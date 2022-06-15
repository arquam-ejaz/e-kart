import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase";
import "./Login.css";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { login } from '../../utils'
import 'regenerator-runtime/runtime'
import * as buffer from 'buffer';
import img from '../../images/logo.png'

window.Buffer = buffer.Buffer;

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (window.walletConnection.isSignedIn()){
    navigate('/')
  }
  
  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(auth => {
        navigate('/')
      })
      .catch(error => alert(error.message))
  }

  const signInWeb3 = (e) => {
    e.preventDefault();
    login().then(() => { navigate('/') });
  }

  const register = e => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((auth) => {
        // sucessfully created a new user with email and password
        if (auth) {
          navigate('/')
        }
      })
      .catch(error => alert(error.message))
  }


  return (
    <div className="login">
      <Link to="/">
        <img
          className="login__logo"
          src={img}
          alt=""
        />
      </Link>
      <div className="login__container">
        <h1>Sign-in</h1>
        <form>
          <h5>E-mail</h5>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            onClick={signIn}
            className="login__signInButton"
          >
            Sign In
          </button>
        </form>

        <p>
          By creating an account, you agree to E-kart's Conditions of Use
          and Privacy Notice.
        </p>
        <button onClick={register} className="login__registerButton">
          Create Your E-kart Account
        </button>
        <button
            onClick={signInWeb3}
            className="login__signInButton"
          >
            Sign In using WEB3 Wallet
          </button>
      </div>
    </div>
  );
}

export default Login;
