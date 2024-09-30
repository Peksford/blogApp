const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[2]);
  await blogObject.save();

  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({
    username: 'root',
    passwordHash,
    id: '66f5e111fbfd56fadd2cff3c',
  });

  await user.save();
});

describe('Blogs JSON', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs');
    //console.log("Header-test", response.headers['content-type'])

    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  test('blogs identifying field is named id', async () => {
    const response = await api.get('/api/blogs');
    const blogi = response.body;

    for (const i in blogi) {
      expect(blogi[i].id).toBeDefined();
    }
  });

  test('blogs are added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Async Test',
      url: 'fullstackopen.com/osa4',
      likes: 99,
    };

    const credentials = {
      username: 'root',
      password: 'sekret',
    };

    const response = await api.post('/api/login').send(credentials).expect(200);
    const token = response.body.token;

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((n) => n.title);
    expect(titles).toContain('async/await simplifies making async calls');
  });

  test('blog that dont have field likes -> likes 0', async () => {
    const newBlog = {
      title: 'blogi ei sisalla tykkayksia',
      author: 'Jee Jee',
      url: 'safkgnd.fi',
    };

    const credentials = {
      username: 'root',
      password: 'sekret',
    };

    const response = await api.post('/api/login').send(credentials).expect(200);
    const token = response.body.token;

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('blog without title or url', async () => {
    const newBlog = {
      author: 'Test Author',
      like: 9,
    };

    const credentials = {
      username: 'root',
      password: 'sekret',
    };

    const response = await api.post('/api/login').send(credentials).expect(200);
    const token = response.body.token;

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    console.log('blogtodelete', blogToDelete);

    const credentials = {
      username: 'root',
      password: 'sekret',
    };

    const response = await api.post('/api/login').send(credentials).expect(200);
    const token = response.body.token;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  });

  test('blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const newLikes = {
      likes: 99,
    };

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newLikes).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].likes).not.toEqual(helper.initialBlogs[0].likes);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
