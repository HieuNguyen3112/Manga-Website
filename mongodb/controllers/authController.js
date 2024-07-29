const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

    //login
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if (!user){
                res.status(404).json("Wrong username!");
            }          
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword){
                res.status(404).json("Wrong password");
            }
            if (user && validPassword){
                const accessToken = jwt.sign({
                    id : user.id,
                    admin : user.admin
                }, 
                process.env.JWT_ACCESS_KEY,
                {expiresIn: "30d"}
                );  
                const refreshToken = jwt.sign({
                    id : user.id,
                    admin : user.admin
                },
                process.env.JWT_REFRESH_KEY,
                {expiresIn: "365d"}
                ); 
                const {password, ...others} = user._doc;
                res.status(200).json({...others, accessToken, refreshToken});
            }

        } catch (err) {
            res.status(500).json(err);
        }
    }
};

module.exports = authController;