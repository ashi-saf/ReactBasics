import React from 'react';
import { useState } from 'react';
import DataContext from './context/DataContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/post';
import { format } from 'date-fns';

const NewPost = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const { posts, setPosts } = useContext(DataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy PP');
    const newPost = {
      id,
      title: postTitle,
      datetime,
      body: postBody,
    };
    try {
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    } catch (error) {
      console.log(`Error:${error.message}`);
    }
  };
  return (
    <main className="NewPost">
      <h2>New Post</h2>
      <form className="newPostForm" onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Title:</label>
        <input
          type="text"
          id="postTitle"
          required
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <label htmlFor="postBody">Post:</label>
        <textarea
          name=""
          id="postBody"
          required
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default NewPost;
