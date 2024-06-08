import { JSONContent, useEditor, EditorContent } from "@tiptap/react";
import React from "react";
import StarterKit from "@tiptap/starter-kit";

const ProductDescription = ({ content }: { content: JSONContent }) => {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit],
    content: content,
    editorProps: {
        attributes: {
          class: "prose prose-sm sm:prose-base",
        },
      }
  });
  if (!editor) {
    return null;
  }
  
    return <EditorContent editor={editor} />;
};

export default ProductDescription;
