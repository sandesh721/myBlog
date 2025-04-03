import React, { useEffect, useState } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import "froala-editor/js/froala_editor.pkgd.min.js"; 
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/plugins/image.min.css";
import { createClient } from "@supabase/supabase-js";
import "../css/publish.css";
import NavBar from "../components/navbar";
import { supabase } from "../auth/supabase";
import { useLocation, useNavigate } from "react-router-dom";



const Publish = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    if (location.state?.article) {
        const { article } = location.state;
        setTitle(article.heading);
        setContent(article.article);
        setExistingImageUrl(article.img_url);
    }
}, [location]);
// Handle Image Display
const imagePreview = image ? URL.createObjectURL(image) : existingImageUrl;
  const handleImageUpload = async (file) => {
    try {
      if (!file) {
        alert("No file selected");
        return "";
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return "";
      }

      setLoading(true);
      const fileName = `images/${Date.now()}_${file.name}`;

      // Upload image to Supabase Storage
      const { data, error } = await supabase.storage.from("articleImages").upload(fileName, file);
      if (error) throw error;

      // Get public URL of uploaded image
      const { data: urlData } = supabase.storage.from("articleImages").getPublicUrl(fileName);
      setLoading(false);
      return urlData.publicUrl;
    } catch (error) {
      setLoading(false);
      console.error("Error uploading file:", error);
      alert("Failed to upload image. Please try again.");
      return "";
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required!");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = existingImageUrl;
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      // Insert article data into Supabase Database
      const { error } = await supabase
        .from("articles")
        .upsert([
            {
                id: location.state?.article?.id, // Ensure the ID is passed for updates
                heading: title,
                article: content,
                img_url: imageUrl,
                created_at: new Date().toISOString(),
            },
        ]);

      if (error) throw error;

      alert("Article published successfully!");
      setTitle("");
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("Error publishing article:", error);
      alert("Failed to publish article. Please try again.");
    } finally {
      setLoading(false);
    }
    navigate("/article");
  };

  return (
    <div className="publishContainer">
      <NavBar />
      <h1>Publish Article</h1>
      <input
        type="text"
        placeholder="Enter the Heading"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {existingImageUrl && !image && <img src={existingImageUrl} alt="Existing Article" className="img"/>}
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <FroalaEditorComponent  
        config={{
          toolbarSticky: true,
          toolbarStickyOffset: 60,
          heightMin: 300,
          heightMax: 500,
          theme: "gray",
          toolbarButtons: [
            "bold", "italic", "underline", "strikeThrough", "formatOL", "formatUL", "insertImage", "html", 
          ],
        }}
        tag="textarea" 
        model={content} 
        className="froala" 
        onModelChange={setContent} 
      />
      <button onClick={handlePublish} disabled={loading}>
        {loading ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
};

export default Publish;
