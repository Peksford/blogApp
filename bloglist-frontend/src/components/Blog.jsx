import { useState } from 'react';

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={blogStyle} className="blog">
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}{' '}
        <button id="show-content" onClick={toggleVisibility}>
          view
        </button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <br></br>
        {blog.url}
        <br></br>
        likes {blog.likes}{' '}
        <button id="like-button" onClick={handleLike}>
          like
        </button>
        <br></br>
        {blog.user?.name ? (
          <div>{blog.user.name}</div>
        ) : (
          <div>User not available</div>
        )}
        {blog.user?.username === user.username ? (
          <button id="remove-button" onClick={handleDelete}>
            remove
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Blog;
