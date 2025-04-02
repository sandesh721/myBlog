import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
import "../css/article.css";
import { supabase } from "../auth/supabase";
import { useEffect, useState } from "react";
function Article(){
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    function handlePublish(){
        navigate("/publish");
    }

    useEffect(()=>{

        const fetchArticles = async() =>{
            const{data, error} = await supabase.from("articles").select("*");
            if (error) {
                console.error("Error fetching articles:", error.message);
              } else {
                console.log(data);
                setArticles(data);
              }
        }
        fetchArticles();
    },[]);

    
    return (
        <div className="articleContainer">
            <NavBar />

            <div className="articleContent">
                <h1>Articles</h1>
                <button className="publishBtn" onClick={handlePublish}> Publish Article + </button>

                <div className="filter">
                    <input type='search' className="search" placeholder="Search articles..." /> 
                    <select> 
                        <option value='newest'>Newest First</option>
                        <option value='popular'>Popular</option>
                    </select>
                </div>

                <div className="listArticles">
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <div key={article.id} className="articleCard">
                                <img src={article.img_url} alt={article.heading} />
                                <div className="articleDetails">
                                    <h2>{article.heading}</h2>
                                    <p>
                                        {article.article
                                            ? article.article.length > 100 
                                            ? article.article.substring(0, 200) + "..."
                                            : article.article
                                            : "No content available"}
                                    </p>
                                    <button className="readMore">Read More</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No articles found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Article;