import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
// import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";

const TiptapEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Heading],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div>
      <div className="editor-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
        {/* <button onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button> */}
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
