import PostPage from './PostPage';
import NewPost from './NewPost';
import About from './About';
import Missing from './Missing';
import Home from './Home';
import Layout from './Layout';
import EditPost from './EditPost';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from './api/post';

import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';
import { DataContextProvider } from './context/DataContext';

function App1() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { data, fetchError, isLoading } = useAxiosFetch(
    'http://localhost:3500/posts'
  );

  useEffect(() => {
    setPosts(data);
  }, [data]);
  //using axios to fetch data from json server
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await api.get('/posts');
  //       setPosts(response.data);
  //     } catch (error) {
  //       if (error.response) {
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else {
  //         console.log(`Error:${error.message}`);
  //       }
  //     }
  //   };
  //   fetchPosts();
  // }, []);
  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

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

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy PP');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(
        posts.map((post) => (post.id === id ? { ...response.data } : post))
      );
      setEditTitle('');
      setEditBody('');
      navigate('/');
    } catch (error) {
      console.log(`Error:${error.message}`);
    }
  };
  const handleDelete = async (id) => {
    console.log(id);

    try {
      await api.delete(`/posts/${id}`);
      const postList = posts.filter((post) => post.id !== id);
      setPosts(postList);
      navigate('/');
    } catch (error) {
      console.log(`Error:${error.message}`);
    }
  };
  return (
    <Routes>
      <DataContextProvider>
        <Route
          path="/"
          element={
            <Layout search={search} setSearch={setSearch} width={width} />
          }
        >
          <Route
            index
            element={
              <Home
                posts={searchResults}
                isLoading={isLoading}
                fetchError={fetchError}
              />
            }
          />
          <Route path="post">
            <Route
              index
              element={
                <NewPost
                  postBody={postBody}
                  postTitle={postTitle}
                  setPostTitle={setPostTitle}
                  setPostBody={setPostBody}
                  handleSubmit={handleSubmit}
                />
              }
            />
            <Route
              path=":id"
              element={
                <EditPost
                  posts={posts}
                  editBody={editBody}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  setEditBody={setEditBody}
                  handleEdit={handleEdit}
                />
              }
            />
            <Route
              path=":id"
              element={<PostPage posts={posts} handleDelete={handleDelete} />}
            />
          </Route>
          <Route path="about" element={<About />} />
          <Route path="*" element={<Missing />} />
        </Route>
      </DataContextProvider>
    </Routes>
  );
}

export default App1;
