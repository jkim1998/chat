import React from "react";
// import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { AiOutlineGooglePlus, AiFillFacebook } from "react-icons/ai";

const Login = () => {
  return (
    <div id="login-page">
      <div id="login-card">
        <h2>welcome to chat</h2>

        <div className="login-button google">
          <AiOutlineGooglePlus />
        </div>
        <div className="login-button facebook">
          <AiFillFacebook />
        </div>
      </div>
    </div>
  );
};

export default Login;
