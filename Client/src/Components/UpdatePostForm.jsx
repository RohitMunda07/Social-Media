import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { put } from "../APIs/api.js";

export default function UpdatePostForm({ existingPost, onPreviewChange, }) {
  const [content, setContent] = useState(existingPost?.content || "");
  const [image, setImage] = useState(existingPost?.image || "");
  const [title, setTitle] = useState(existingPost?.title || "")
  const [updateState, setUpdateState] = useState("")

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
  };

  const handlePostUpdate = async () => {
    const postId = existingPost?.postId
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", content)

    if (image instanceof File) {
      formData.append("images", image);
    }
    
    try {
      setUpdateState("post updating...")
      const url = "post/update-post/" + postId

      const res = await put(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        // params: { postId },
        withCredentials: true
      })

      setUpdateState("Post Updated Successfully")
      console.log("Post Updated Successfully", res?.data?.data);

    } catch (error) {
      console.log("full error", error);
      console.log(error?.response?.message || "error while updating the post from front-end");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Edit Your Post</h2>

      {
        updateState.length > 0 &&
        <p>
          {updateState}
        </p>
      }

      <TextField
        label="Post Title"
        // multiline
        // rows={6}
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
      />

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
        onClick={() => handlePostUpdate()}
      >
        Update Post
      </Button>
    </form>
  );
}
