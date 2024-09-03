import PostPage from './PostPage';
import NewPost from './NewPost';
import About from './About';
import Missing from './Missing';
import Home from './Home';
import Layout from './Layout';
import EditPost from './EditPost';
import { Routes, Route } from 'react-router-dom';
import { DataContextProvider } from './context/DataContext';

function App() {
  return (
    <DataContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post">
            <Route index element={<NewPost />} />
            <Route path="edit/:id" element={<EditPost />} />
            <Route path=":id" element={<PostPage />} />
          </Route>
          <Route path="about" element={<About />} />
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </DataContextProvider>
  );
}

export default App;
