import React, { useEffect, useState } from "react";
import "../css/home.css"; // ensure you have the correct path
import NavBar from "../components/navbar";
import { supabase } from "../auth/supabase";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { useNavigate } from "react-router-dom";
import whatsapp from "../components/logo/whatsapp.png";
import linkedin from "../components/logo/linkedin.png";
import twitter from "../components/logo/twitter.png";
import github from "../components/logo/github.png";
import instagram from "../components/logo/instagram.png";


function Home() {
    const navigate = useNavigate();
    const [articles, setArticle] = useState([]);
    function handleRead(id){
        navigate(`/read/${id}`);
    }
    useEffect(() =>{

        const fetchArticle = async()=>{
            const {data, error}  = await supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(3);
            if (error) {
                console.error("Error fetching articles:", error.message);
              } else {
                console.log(data);
                setArticle(data);
              }
        } 
        fetchArticle();
    },[])
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
                <button className="exploreButton" onClick={()=> navigate("/article")}>Explore More</button>
            </div>

            <div className="someArticles">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <div key={article.id} className="articleCard" onClick={() =>handleRead(article.id)}>
                            <img src={article.img_url} alt={article.heading} />
                            <div className="articleDetails">
                                <h2>{article.heading}</h2>
                                <p>
                                <FroalaEditorView className="fr-view" model={article.article} />
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No articles found.</p>
                )}
            </div>

            <footer className="footer">
            <div className="footer-container">
                {/* Branding */}
                <div className="footer-brand">
                    <h2>Antaranga</h2>
                    <p>Sharing thoughts, one article at a time.</p>
                </div>

                {/* Navigation */}
                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/about">About</a></li>
                        <li><a href="/articles">Articles</a></li>
                        <li><a href="/quotes">Quotes</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className="footer-social">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="#"><img src={github} alt='github'/></a>
                        <a href="#"><img src={instagram} alt='instagram'/></a>
                        <a href="#"><img src={linkedin} alt='linkedin'/></a>
                        <a href="#"><img src={twitter} alt='twitter'/></a>
                        <a href="#"><img src={whatsapp} alt='whatsapp'/></a>
                        
                    </div>
                </div>

                {/* Newsletter */}
                <div className="footer-newsletter">
                    <h3>Subscribe</h3>
                    <p>Get the latest articles delivered to your inbox.</p>
                    <input type="email" placeholder="Enter your email" />
                    <button>Subscribe</button>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>&copy; 2025 Antaranga. All rights reserved.</p>
            </div>
        </footer>
        </div>
    );
}

export default Home;