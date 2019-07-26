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
  db.findById(id)
  .then(user => {
    if(user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
  })
  .catch( err => {
    res.status(500).json({ error: "The user information could not be retrieved." })
  })
})

server.post('/api/users',(req, res) => {
  const { name, bio } = req.body
  const newUser = { name, bio }
  if( !name || !bio ) {
    return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  } else {
    db.insert(newUser)
    .then(users => {
      res.status(201).json(users)
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
  }
})

server.delete('/api/users/:id' , (req, res) => {
  const { id } = req.params
  let deletedUser = db.findById(id).then(user => user)
  db.remove(id)
  .then( users => {
    if(users === 0) {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
      res.status(200).json(deletedUser.fulfillmentValue)
    }
  })
  .catch( err => res.status(500).json({ error: "The user could not be removed" }))
})

server.put('/api/users/:id' , (req, res) => {
  const { id } = req.params
  const updatedUser = req.body
  db.update(id, updatedUser)
  .then(users => {
    if(users === 0) {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
      res.status(200).json(updatedUser)
    }
  })
  .catch(err => res.status(500).json({ error: "The user information could not be modified." }))
})

server.listen(3000, () => {
  console.log(`server listening on port ${port}`)
})
