const Blog = require('../models/blog');
const User = require('../models/user');
require('express-async-errors');

const initialBlogs = [
  {
    title: 'TestiBlogi',
    author: 'Peksi',
    url: 'peksiblogi.fi',
    likes: '2',
    user: '66f5e111fbfd56fadd2cff3c',
  },
  {
    title: 'jee',
    author: 'juu',
    url: 'joo.fi',
    likes: '4',
    user: '66f5e111fbfd56fadd2cff3c',
  },
  {
    title: 'asdfg',
    author: 'fghj',
    url: 'ofihmg.fi',
    likes: '7',
    user: '66f5e111fbfd56fadd2cff3c',
  },
];

const initialUsers = [
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    id: '66f5e111fbfd56fadd2cff3c',
  },
];

{
  /*const createUser = async () => {
    newUser = initialUsers[0]

    response_newUser = await api
    .post('/api/users')
    .send(newUser)

    newLogin = {
        username: response_newUser.body.username,
        password: response_newUser.body.password
    }

    login_newUser = await api
    .post('/api/login')
    .send(newLogin)
    
    console.log("tokenia nakyyko?", login_newUser.body)
}
*/
}

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialUsers,
  initialBlogs,
  blogsInDb,
  usersInDb,
};
