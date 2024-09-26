const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const jwt = require('jsonwebtoken')

const api = supertest(app)
const Blog = require('../models/blog')

// token must be found out from logging in using 'login.rest'
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2NGZiMmM0Njc3NjIzOWJiNGNjZGY2ZWUiLCJpYXQiOjE2OTQxODI5MjV9.MwdI7yFrxSq1f5N5X3g1JFJUduhzPC93o0u-i6LGSQg"

{/*const initialBlogs = [
    {
        title: "TestiBlogi",
        author: "Peksi",
        url: "peksiblogi.fi",
        likes: "2",
        user: "64f9f929497b12473cd8fef6"
    },
    {
        title: "jee",
        author: "juu",
        url: "joo.fi",
        likes: "4",
        user: "64f9f929497b12473cd8fef6"
    },
    {
        title: "asdfg",
        author: "fghj",
        url: "ofihmg.fi",
        likes: "7",
        user: "64f9f929497b12473cd8fef6"
    }
]
*/}
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[2])
    await blogObject.save()
})


describe('Blogs JSON', () => {
    test('blogs are returned as json', async () => {
        const response = await api.get('/api/blogs')
        //console.log("Header-test", response.headers['content-type'])
        
        expect(response.headers['content-type']).toMatch(/application\/json/)
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(3)
    })

    test('blogs identifying field is named id', async () => {
        const response = await api.get('/api/blogs')
        const blogi = response.body
    
        for (const i in blogi) {
            expect(blogi[i].id).toBeDefined()
        }      
    })

    test('blogs are added', async () => {
        const newBlog = {
            "title": "async/await simplifies making async calls",
            "author": "Async Test",
            "url": "fullstackopen.com/osa4",
            "likes": 99
        }
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain(
            'async/await simplifies making async calls'
        )
    })

    test('blog that dont have field likes -> likes 0', async () => {
        const newBlog = {
            "title": "blogi ei sisalla tykkayksia",
            "author": "Jee Jee",
            "url": "safkgnd.fi"
        }
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    })

    test('blog without title or url', async () => {
        const newBlog = {
            "author": "Test Author",
            "like": 9
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    })

    test('blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const newLikes = {
            "likes": 99
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newLikes)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].likes).not.toEqual(helper.initialBlogs[0].likes)
    })
})



afterAll(async () => {
  await mongoose.connection.close()
})