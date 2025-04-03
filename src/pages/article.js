import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
import "../css/article.css";
import { supabase } from "../auth/supabase";
import { useEffect, useState } from "react";
import 'froala-editor/css/froala_editor.css';
import 'froala-editor/css/froala_style.css';

import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
function Article(){
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    function handlePublish(){
        navigate("/publish");
    }
    function handleRead(id){
        navigate(`/read/${id}`);
    }
    useEffect(()=>{

        const fetchArticles = async() =>{
            const{data, error} = await supabase.from("articles").select("*").order("created_at", { ascending: false });
            if (error) {
                console.error("Error fetching articles:", error.message);
                setLoading(false);
              } else {
                console.log(data);
                setArticles(data);
                setLoading(false);
              }
        }
        fetchArticles();
    },[]);

    
    return (
        <div className="articleContainer">
            <NavBar />
            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : (
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
            </div>
            )
        }
        </div>
    );
}
export default Article;