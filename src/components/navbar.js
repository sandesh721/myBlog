import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css'
import ant from "./images/ant.png";
 
function NavBar(){
    const navigate = useNavigate();
    return(
        <nav className="navbar">
            <div className="container_navbar">
                <img src={ant} alt= "Antaranga" height={40} onClick={()=>navigate("/")}/>
                <ul className="navbarList">
                    <li className="navItem"> <Link to="/">Home</Link> </li>
                    <li className="navItem"> <Link to="/article">Article</Link> </li>
                    <li className="navItem"> <Link to="/quote">Quote</Link> </li>
                    <li className="navItem"> <Link to="/login">Logout</Link> </li>
                </ul>
            </div>
        </nav>
    );
}
export default NavBar;