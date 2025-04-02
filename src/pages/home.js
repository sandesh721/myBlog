import React from "react";
import "../css/home.css"; // ensure you have the correct path
import NavBar from "../components/navbar";

function Home() {
    return (
        <div className="homeContainer">
            <div className="main">
                    <NavBar />
                <div className="mainContent">
                    <h1>ANTARANAGA</h1>
                    <p>Deeper thoughts that inspire me to write.</p>
                </div>
            </div>

            <div className="about">
                <div className="aboutContent">
                    <h2>About Me</h2>
                    <p>I am a casual writer who writes whenever I feel inspired or deeply moved by something. When something bothers me, I pick up my pen and start writing. My thoughts and words are purely my own—they may be true or false, but to the best of my knowledge, they are authentic. Writing allows me to lose myself in deep thinking, and that brings joy to me.</p>
                </div>
            </div>

            <div className="buttons">
                <p>Recent Articles</p>
                <button className="exploreButton">Explore More</button>
            </div>

            <div className="someArticles">
                {[...Array(3)].map((_, index) => (
                    <div className="card" key={index}>
                        <h3>Article {index + 1}</h3>
                        <p>Some brief description of the article goes here.</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;