import React from "react";
// import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { AiOutlineGooglePlus, AiFillFacebook } from "react-icons/ai";
import "firebase/app";

import { auth } from '../firebase';
import firebase from "firebase/app";

const Login = () => {
  return (
    <div id="login-page">
      <div id="login-card">
        <h2>welcome to chat</h2>
        <div className="button_container">
          <div className="login-button google" onClick={() => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())}>
            <AiOutlineGooglePlus size={30} />
            <p>Sign in with Google</p>
          </div>
          <div className="login-button facebook" onClick={() => auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider())}>
            <AiFillFacebook size={30} />
            <p>sign in with Facebook</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
