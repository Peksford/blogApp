import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import BlogFrom from './BlogForm';

test('renders content', async () => {
  const blog = {
    title: 'Testing title',
    author: 'testing author',
    user: {
      name: 'Matti Luukkainen',
      username: 'testi',
    },
  };

  //UserModel.findOne.mockResolvedValue(mockUser)
  render(<Blog blog={blog} user={blog.user} />);
  const element = screen.getByText('Testing title testing author');
  //screen.debug(element)
  expect(element).toHaveTextContent('Testing title');
});

test('shows contents of blog when "view" is pressed', async () => {
  const blog = {
    title: 'Testing title',
    author: 'testing author',
    likes: 5,
    url: 'test.url',
    user: {
      name: 'Matti Luukkainen',
      username: 'testi',
    },
  };
  const mockHandler = jest.fn();

  const container = render(
    <Blog blog={blog} handleLike={mockHandler} user={blog.user} />
  ).container;
  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  const div = container.querySelector('#show-content');
  expect(div).toHaveTextContent('view');

  const title_author = screen.getByText('Testing title testing author');
  //const author = screen.getByText('testing author')
  const url = screen.getByText(/test.url/);
  const likes = screen.getByText(/likes \d+/);

  expect(title_author).toHaveTextContent('Testing title testing author');
  //expect(author).toHaveTextContent(
  //  'testing author'
  //)
  expect(url).toHaveTextContent('test.url');
  expect(likes).toHaveTextContent('likes 5');
});

test('like button clicked twice', async () => {
  const blog = {
    title: 'Testing title',
    author: 'testing author',
    likes: 5,
    url: 'test.url',
    user: {
      name: 'Matti Luukkainen',
      username: 'testi',
    },
  };
  const mockHandler = jest.fn();

  const container = render(
    <Blog blog={blog} handleLike={mockHandler} user={blog.user} />
  ).container;
  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  const div = container.querySelector('#show-content');
  expect(div).toHaveTextContent('view');

  const likeButton = screen.getByText('like');
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  await user.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(2);
});

test('Blog is created properly', async () => {
  const createBlog = jest.fn();

  render(<BlogFrom createBlog={createBlog} />);

  const inputTitle = screen.getByPlaceholderText('input title');
  const inputAuthor = screen.getByPlaceholderText('input author');
  const inputUrl = screen.getByPlaceholderText('input url');

  const blog = {
    title: 'Testi title',
    author: 'Testi author',
    url: 'Testi url',
  };

  await userEvent.type(inputTitle, blog.title);
  await userEvent.type(inputAuthor, blog.author);
  await userEvent.type(inputUrl, blog.url);

  const createButton = screen.getByText('create');
  await userEvent.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('Testi title');
  expect(createBlog.mock.calls[0][0].author).toBe('Testi author');
  expect(createBlog.mock.calls[0][0].url).toBe('Testi url');
});
