import { useEffect, useState } from "react";
import NavBar from "../components/navbar";
import "../css/readArticle.css";
import { supabase } from "../auth/supabase";
import { useNavigate, useParams } from "react-router-dom";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import CommentSection from "../components/comments";
import { auth } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useUser } from "../auth/userContext";
function ReadArticle() {
    const [article, setArticle] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [likeCount, setLikeCount] = useState(0);

    const { user } = useUser();  

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                
                setUserEmail(user.email);
                checkIfLiked(user.email);
            }
        });
        return () => unsubscribe();
    }, [article]);

    const checkIfLiked = async (email) => {
        if (!article) return;
        const { data } = await supabase
            .from("articleLikes")
            .select("*")
            .eq("article_id", article.id)
            .eq("user_email", email);
    
        if (data?.length > 0) setLiked(true);

        const { count } = await supabase
        .from("articleLikes")
        .select("*", { count: "exact", head: true })
        .eq("article_id", article.id);

        setLikeCount(count || 0);
    };

    const handleLike = async () => {
        if(!userEmail) return navigate("/login"); 

        if(liked) return;

        const {error} = await supabase.from("articleLikes").insert([
            {
                article_id : article.id,
                user_email: userEmail
            },
        ]);

        if(!error){
            setLiked(true);
            setLikeCount((prev) => prev + 1);
        }else{
            console.error("Error liking article:", error.message);
        }
    }

    const handleShare = async () => {
        try{
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }catch(err){
            console.error("Failed to copy: ", err);
        }
    }
    console.log(user?.email);
    return (
        <div className="readContainer">
            <NavBar />
            {loading ? (
    <div className="loader-container">
        <div className="loader"></div>
    </div>
) : article ? (  
    <>
        <div className="readContent">
        {user && user.email === process.env.REACT_APP_ADMIN && (
            <div className="editDelete">
                <button className="edit" onClick={handleEdit}>Edit</button>
                <button className="delete" onClick={handleDelete}>Delete</button>
            </div>
         )}
            <h1>{article.heading}</h1>
            <img src={article.img_url} alt={article.heading} />
            <FroalaEditorView model={article.article} />

            <div className="like_share">
                <button onClick={handleLike}>{liked ? "❤️ Liked" : "🤍 Like"} ({likeCount})</button>
                <button onClick={handleShare}>🔗 Share</button>
            </div>
        </div>

        <div className="commentSection">
        <CommentSection articleId={article.id} />
        </div>
    </>
) : null }  

        </div>
    );
}

export default ReadArticle;
