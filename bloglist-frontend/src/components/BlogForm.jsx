import { useState } from 'react'

const NewBlog = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const createNew = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={createNew}>
      <div>
        title:<input
          id='title'
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          placeholder='input title'/>
      </div>
      <div>
        author:<input
          id='author'
          value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
          placeholder='input author'/>
      </div>
      <div>
        url:<input
          id='url'
          value={newUrl}
          onChange={event => setNewUrl(event.target.value)}
          placeholder='input url'/>
      </div>
      <div>
        <button id="create-button" type="submit">create</button>
      </div>
    </form>
  )
}



export default NewBlog