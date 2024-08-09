const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let refreshTokens = [];
const authController = {
    //Đăng ký
    registerUser: async(req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Tạo người dùng mới
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            //Lưu vào database
            const savedUser = await newUser.save();
            res.status(200).json(savedUser);

        } catch (err){
            console.error("Error in registerUser:", err); 
            res.status(500).json({ error: "Internal server error" });
        }
    },

    //generate access token
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id : user.id,
                admin : user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30d" }
        );
    },

    //generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id : user.id,
                admin : user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30d" }
        );
    },

    //login
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if (!user){
                return res.status(404).json("Wrong username!");
            }          
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword){
                return res.status(404).json("Wrong password");
            }
            if (user && validPassword){
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                const {password, ...others} = user._doc;
                res.status(200).json({...others, accessToken});
            }

        } catch (err) {
            res.status(500).json(err);
        }
    },

    requestRefreshToken: async (req, res) => {
        //Lấy refresh token từ user
        const refreshToken = req.cookies.refreshToken;
        res.status(200).json(refreshToken);
        if (!refreshToken) return res.status(401).json("You're not authenticated!");
        if (!refreshTokens.includes(refreshToken)){
            return res.status(403).json("Refresh token is not valid!");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err){
                console.log(err);
            }
            refreshToken = refreshTokens.filter((token) => token !== refreshToken);
            //create new accessToken, refreshToken
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({accessToken: newAccessToken});
        });
    },

    //logout
    userLogout: async(req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Logged out successfully");
    },

    // Forgot password
    forgotPassword: async (req, res) => {
        const { userName, email, newPassword } = req.body;
    
        try {
            // Tìm người dùng trong bảng users dựa trên username
            const user = await User.findOne({ username: userName });
    
            // Kiểm tra nếu người dùng không tồn tại
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
    
            // Kiểm tra email của người dùng để xác thực (nếu cần)
            if (user.email !== email) {
                return res.status(400).json({ success: false, message: "Email does not match" });
            }
    
            // Mã hóa mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
    
            // Cập nhật mật khẩu mới cho người dùng trong bảng users
            user.password = hashedPassword;
            await user.save();
    
            res.status(200).json({ success: true, message: "Password reset successful" });
    
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    
};

//store token


module.exports = authController;