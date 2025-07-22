import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const SimpleRichTextEditor = ({ value, onChange, placeholder = "Nhập nội dung..." }) => {
 
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "list", "bullet",
    "align",
    "link", "image",
    "clean"
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
    />
  );
};

export default SimpleRichTextEditor; 