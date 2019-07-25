// implement your API here
const express = require('express')
const db = require('./data/db.js')

const server = express()
const port = 3000
server.use(express.json())

server.get('/api/users', (req, res) => {
  db.find()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    res.status(500).json({ error: "The users information could not be retrieved." })
  })
})

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params
  let foundGetUser = db.findById(id).then(user => user)
  if(foundGetUser) {
    db.findById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({ error: "The user information could not be retrieved." })
    })
  } else {
    return res.status(404).json({ message: "The user with the specified ID does not exist." })
  }
})

server.post('/api/users',(req, res) => {
  const { name, bio } = req.body
  const newUser = { name, bio }
  if( !name || !bio ) {
    return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  } else {
    db.insert(newUser)
    .then(users => {
      res.status(201).json({sucess: true, users})
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
  }
})

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params
  let foundDeleteUser = db.findById(id).then(user => user)
  if(foundDeleteUser) {
    db.remove(id)
    .then(user => {
      res.status(204).json(user)
    })
    .catch(err => {
      res.status(404).json({success: false, err})
    })
  } else {
    return res.status(500).json({ error: "The user could not be removed" })
  }
})

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params
  const { name, bio } = req.body
  let foundUpdateUser = db.findById(id).then(user => user)
  if(foundUpdateUser) {
    if(!name || !bio) {
      return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
      db.update( id, req.body )
      .then(users => {
        res.status(200).json({users})
      })
      .catch(err => {
        res.status(500).json({ error: "The user information could not be modified." })
      })
    }
  } else {
    return res.status(404).json({ message: "The user with the specified ID does not exist." })
  }
})

server.listen(3000, () => {
  console.log(`server listening on port ${port}`)
})
