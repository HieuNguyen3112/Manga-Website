import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/apiRequest";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const newUser = {
            username: username,
            password: password,
        };
        loginUser(newUser, dispatch, navigate);
    }

    return ( 
        <section className="login-container">
            <div className="login-title">Đăng nhập</div>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="userName" className="form-label">Tên đăng nhập</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="userName" 
                        placeholder="Nhập tên người dùng"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Nhập mật khẩu</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="rememberpassword" />
                    <label className="form-check-label" htmlFor="rememberpassword">Nhớ mật khẩu</label>
                </div>
                <button type="submit" style="width: 100%;" className="btn btn-primary mt-3">Đăng nhập</button>
            </form>
            <p className="text-center mt-2">
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
        </section>
    );
}

export default Login;
