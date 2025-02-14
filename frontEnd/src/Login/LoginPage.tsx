import React, { useState } from "react";
import "./LoginPage.css";
import { NavLink, useNavigate } from "react-router-dom";
import img1 from "../img/img1.webp";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  const [userCredentials, setUserCredentials] = useState({
    EMAIL: "",
    PASSWORD: "",
  });

  const handleUserInput =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserCredentials((prev) => ({
        ...prev,
        [fieldName.toUpperCase()]: e.target.value,
      }));
    };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://melanine-backend.onrender.com/api/user/sign-in",
        {
          method: "POST",
          body: JSON.stringify({
            email: userCredentials.EMAIL,
            password: userCredentials.PASSWORD,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setErrorText("Email hoặc mật khẩu không chính xác");
        } else {
          setErrorText("Lỗi từ máy chủ. Vui lòng thử lại.");
        }
        setIsLoading(false);
        return;
      }

      const res = await response.json();
      const { access_token, user } = res;

      if (access_token) {
        localStorage.setItem("profile", JSON.stringify(user));
        localStorage.setItem("user_id", user?._id);
        localStorage.setItem("access_token", access_token);

        user?.isAdmin ? navigate("/admin") : navigate("/home");
        setErrorText(""); // Reset error text on success
      } else {
        setErrorText("Lỗi đăng nhập. Vui lòng thử lại.");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Network Error:", error);
      setErrorText("Lỗi mạng. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <img
        src={img1}
        className="login__img"
        loading="eager"
        alt="Login background"
      />
      <form className="login__form">
        <p className="login__title">Đăng nhập</p>

        <div className="login__content">
          <div className="login__box">
            <i className="ri-user-3-line login__icon"></i>
            <div className="login__box-input">
              <input
                type="email"
                required
                className="login__input"
                id="login-email"
                placeholder=" "
                onChange={handleUserInput("EMAIL")}
              />
              <label htmlFor="login-email" className="login__label">
                Email
              </label>
            </div>
          </div>

          <div className="login__box">
            <i className="ri-lock-2-line login__icon"></i>
            <div className="login__box-input">
              <input
                type="password"
                required
                className="login__input"
                id="login-pass"
                placeholder=" "
                onChange={handleUserInput("PASSWORD")}
              />
              <label htmlFor="login-pass" className="login__label">
                Mật khẩu
              </label>
              <i className="ri-eye-off-line login__eye" id="login-eye"></i>
            </div>
          </div>
        </div>

        <div className="login__check">
          <div className="login__check-group">
            <input
              type="checkbox"
              className="login__check-input"
              id="login-check"
            />
            <label htmlFor="login-check" className="login__check-label">
              Ghi nhớ tôi
            </label>
          </div>

          <a href="/" className="login__forgot">
            Quên mật khẩu
          </a>
        </div>

        {errorText && <span style={{ color: "red" }}>{errorText}</span>}

        <button type="button" className="login__button" onClick={handleLogin}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <NavLink to="/signup" className="ml-3">
          Đăng ký
        </NavLink>
      </form>
    </div>
  );
}

export default LoginPage;
