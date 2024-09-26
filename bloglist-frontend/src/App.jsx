import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import './index.css';
import './components/Togglable';
import Togglable from './components/Togglable';
import NewBlog from './components/BlogForm';
import PropTypes from 'prop-types';
import LoginForm from './components/LoginForm';

const ErrorMessage = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="message">{message}</div>;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [newMessage, setMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      console.log(user);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('wrong username or password');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    console.log('logging out with', username);

    window.localStorage.removeItem('loggedBlogappUser', JSON.stringify(user));

    setUser(null);
  };

  const createNew = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    const newBlog = await blogService.create(blogObject);
    setBlogs([...blogs, newBlog]);
    setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleLike = async (id) => {
    const blogToLike = blogs.find((blog) => blog.id === id);
    console.log('like-button', blogToLike.user);

    if (blogToLike.user === null || blogToLike.user === undefined) {
      const likedBlog = {
        title: blogToLike.title,
        author: blogToLike.author,
        url: blogToLike.url,
        likes: blogToLike.likes + 1,
        id: blogToLike.id,
      };
      await blogService.put(blogToLike.id, likedBlog);
      const updatedBlogs = blogs.map((blog) =>
        blog.id === id ? likedBlog : blog
      );
      setBlogs(updatedBlogs);
    } else {
      const likedBlog = {
        title: blogToLike.title,
        author: blogToLike.author,
        url: blogToLike.url,
        likes: blogToLike.likes + 1,
        user: {
          id: blogToLike.user.id,
          username: blogToLike.user.username,
          name: blogToLike.user.name,
        },
        id: blogToLike.id,
      };
      await blogService.put(blogToLike.id, likedBlog);
      const updatedBlogs = blogs.map((blog) =>
        blog.id === id ? likedBlog : blog
      );
      setBlogs(updatedBlogs);
    }
  };

  const handleDelete = async (id) => {
    const blogToDelete = blogs.findIndex((blog) => blog.id === id);
    const blogToFind = blogs.find((blog) => blog.id === id);
    if (
      window.confirm(`Remove blog ${blogToFind.title} by ${blogToFind.author}?`)
    ) {
      const updatedBlogs = [
        ...blogs.slice(0, blogToDelete),
        ...blogs.slice(blogToDelete + 1),
      ];

      setBlogs(updatedBlogs);
      await blogService.deleteBlog(id);
    }
  };

  const blogFormRef = useRef();

  handleLogin.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  };

  if (user === null) {
    return (
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        errorMessage={errorMessage}
        ErrorMessage={ErrorMessage}
      />
    );
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={newMessage} />
      <p>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </p>
      <h2>create new</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog createBlog={createNew} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={() => handleLike(blog.id)}
            handleDelete={() => handleDelete(blog.id)}
            user={user}
            buttonLabel="show"
          />
        ))}
    </div>
  );
};

export default App;
