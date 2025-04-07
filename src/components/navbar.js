import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css'
import ant from "./images/ant.png";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useUser } from "../auth/userContext";
function NavBar(){
    
    const { user } = useUser();
    const handleLogout = async () => {
        try {
          await signOut(auth);
          alert("Logged out successfully");
          // Optionally navigate to login or home page
          // navigate("/login"); 
        } catch (error) {
          console.error("Error during logout:", error.message);
        }
      };
    const navigate = useNavigate();
    return(
        <nav className="navbar">
            <div className="container_navbar">
                <img src={ant} alt= "Antaranga" height={40} onClick={()=>navigate("/")}/>
                <ul className="navbarList">
                    <li className="navItem"> <Link to="/">Home</Link> </li>
                    <li className="navItem"> <Link to="/article">Article</Link> </li>
                    <li className="navItem"> <Link to="/quote">Quote</Link> </li>
                    {user? (<li className="navItem" onClick={handleLogout}> <Link to="/">Logout</Link> </li>):(
                        <li className="navItem"> <Link to="/login">Login</Link> </li>
                    )}
                    
                </ul>
            </div>
        </nav>
    );
}
export default NavBar;