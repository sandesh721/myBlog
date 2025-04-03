import { useEffect, useState } from "react";
import NavBar from "../components/navbar";
import "../css/readArticle.css";
import { supabase } from "../auth/supabase";
import { useNavigate, useParams } from "react-router-dom";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

function ReadArticle() {
    const [article, setArticle] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const handleDelete = async() => {
        if (!article) return; // Prevents errors if article is null
        const { data, error } = await supabase
            .from("articles")
            .delete()
            .eq("id", article.id); // Corrected filter usage

        if (error) {
            console.error("Error deleting article:", error);
        } else {
            console.log("Article deleted successfully", data);
            // Redirect or update UI
            window.location.href = "/article"; // Redirect to homepage
        }
    };

    function handleEdit(){
        if (!article) return;
        navigate("/publish", {state: {article}});
    }
    useEffect(() => {
        const fetchArticle = async () => {
            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .eq("id", id)
                .single();

            if (!error) {
                setLoading(false);
                setArticle(data);
            } else {
                console.error(error.message);
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    
    return (
        <div className="readContainer">
            <NavBar />
            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : (
            <div className="readContent">
                {article && (
                    <>
                        <div className="editDelete">
                            <button className="edit" onClick={handleEdit}> Edit</button>
                            <button className="delete" onClick={handleDelete}> Delete</button>
                        </div>
                        <h1>{article.heading}</h1>
                        <img src={article.img_url} alt={article.heading} />
                        <FroalaEditorView  model={article.article} />
                    </>
                )}
            </div>
            )}
        </div>
    );
}

export default ReadArticle;
