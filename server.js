const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('pusher-chatkit-server')

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:f868fdaa-207d-4ce6-808a-fcf63c3df09a',
  key:
    'f61a4d87-ffcc-49c3-9959-5a8e7d65b40e:4eP1CcVtRLuBC5Re5LE7+6iWLLXTSTWd0iS16Vo81IU='
})
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  const user = { name: username, id: username }
  chatkit
    .createUser(user)
    .then(() => {
      console.log('Created user ', user.name)
      res.status(201).json(user)
    })
    .catch(error => {
      if (error.error === 'services/chatkit/user_already_exists') {
        console.log('User already exists ', user.name)
        res.status(201).json(user)
      } else {
        console.error(error)
        res.status(error.status).json(error)
      }
    })
})

app.listen(3001)
console.log('Running on port 3001')
