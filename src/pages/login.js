import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";
import { Link, useNavigate } from "react-router-dom";
import "../css/register.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // ✅ Check if user already logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/"); // or homepage
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!email || !password){
        setError("Fill all the fields");
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Login successful!");
      navigate("/");
    } catch (error) {
      setError(`${error.message}`);
    }
  };

  return (
    <div className="register-container">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Account created! Please check your email to confirm. 📧</p>}
      <h2>Login</h2>
      <form className="register-form" onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <div className="loginFooter">
        <span> Don't have account?
        <Link to="/register">Register</Link> </span>
        <Link to="/login">ForgotPassword?</Link> 
        </div>
      </form>
    </div>
  );
};

export default Login;
