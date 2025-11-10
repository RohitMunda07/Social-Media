import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

export default function UpdatePostForm({ existingPost, onPreviewChange }) {
  const [content, setContent] = useState(existingPost.content || "");
  const [image, setImage] = useState(existingPost.image || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImage(previewURL);
      onPreviewChange(previewURL);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle post update API logic here
    console.log("Updated Post:", { content, image });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Edit Your Post</h2>

      <TextField
        label="Post Content"
        multiline
        rows={6}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
        variant="outlined"
      />

      <div>
        <label className="block text-gray-700 mb-2">Change Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && (
          <img
            src={image}
            alt="Selected preview"
            className="mt-3 w-full h-48 object-cover rounded-lg border"
          />
        )}
      </div>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className="mt-4"
      >
        Update Post
      </Button>
    </form>
  );
}
