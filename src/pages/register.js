// src/Register.js
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../auth/firebase";
import "../css/register.css";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if(!email || !password || !confirmPassword){
        setError("Fill all the fields");
        return;
    }

    if (password != confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Registration successful!");
      navigate("/login");

    } catch (err) {
      setError(`${err.message}`);
    }
  };

  return (
    <div className="register-container">
      {error && <p className="error">{error}</p>}
    {success && <p className="success">Account created! Please check your email to confirm. 📧</p>}
      <form className="register-form" onSubmit={handleRegister}>
      <h2>Register</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="confirm Password" onChange={(e) => setconfirmPassword(e.target.value)} required />
        <button type="submit">Register</button>
        
      </form>
    </div>
  );
};

export default Register;
