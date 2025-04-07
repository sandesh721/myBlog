import { useState, useEffect } from "react";
import { auth } from "../auth/firebase"; // your Firebase auth file
import { onAuthStateChanged } from "firebase/auth";
import { supabase } from "../auth/supabase";
import "../css/comments.css";
import { useNavigate } from "react-router-dom";
const CommentSection = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    // ✅ Firebase Auth check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // ✅ Fetch Comments from Supabase
    useEffect(() => {
        const fetchComments = async () => {
            console.log(articleId);
            const { data, error } = await supabase
                .from("commentArticle")
                .select("*")
                .eq("article_id", articleId)
                .order("created_at", { ascending: false });

            if (!error) setComments(data);
        };

        fetchComments();
    }, [articleId]);

    // ✅ Submit Comment to Supabase
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) return alert("Please enter your comment.");
        if (!user) return alert("Please log in to comment.");
    
        const tempComment = {
            id: Date.now(), // Temporary ID
            article_id: articleId,
            username: user.displayName || user.email,
            comment: newComment,
            created_at: new Date().toISOString(),
        };
    
        // Optimistically update the UI
        setComments([tempComment, ...comments]);
        setNewComment("");
    
        const { data, error } = await supabase.from("commentArticle").insert([
            {
                article_id: articleId,
                username: user.displayName || user.email.split("@")[0],
                comment: newComment,
            },
        ]);
    
        if (error) {
            console.error("Insert error:", error.message);
            // Revert optimistic update if error
            setComments(comments);
            alert("Failed to post comment. Please try again.");
        } else {
            // Optionally replace temp comment with real one from DB
            const updated = await supabase
                .from("commentArticle")
                .select("*")
                .eq("article_id", articleId)
                .order("created_at", { ascending: false });
    
            if (!updated.error) setComments(updated.data);
        }
    };
    
    

    return (
        <div className="comment-section">
            <h3>Comments</h3>

            {user ? (
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            ) : (
                <div className="comment-form">
                    <textarea
                        placeholder="Write a comment..."
                        disabled
                    ></textarea>
                    <p>Please <a href="/login">log in</a> to post a comment.</p>
                </div>
            )}

            <div className="comments">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <strong>{comment.username}</strong>
                            <p>{comment.comment}</p>
                            <span className="timestamp">
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
