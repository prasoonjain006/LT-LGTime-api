const mongoose = require('mongoose')
const Express = require('express')
const BodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const { Server, ReplSet } = require('mongodb')

const cors = require('cors')
var app = Express()
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))
app.use(cors())
const User = require('./User')
const Post = require('./Post')
const jwt = require('jsonwebtoken')

const host = '0.0.0.0'

//using local host or port of heroku
const port = process.env.PORT || 5000
app.listen(port, host, () => {
  console.log('listening')
})

// checking endpoints are working or not
app.get('/api', (req, res) => res.send('Its working'))

const secret = 'usingjwt'

// main function, handles calls to database and requests from client
async function main () {
  const uri =process.env.MONGODB_URI;
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  try {
    await client.connect()

    //req To fetch all countries name
    app.get('/loc', (request, response) => {
      const collection = client.db('test').collection('posts')
      collection.find({}).toArray((error, result) => {
        console.log(result)
        console.log(error)
        if (error) {
          return response.status(500).send(error)
        }
        response.send(result)
      })
    })

    // Whenever user log in, JWT token will be verified
    app.post('/auth', (req, res) => {
      const { email, password } = req.body
      User.findOne({ email }, (err, user) => {
        if (err) {
          res.status(500).send('Internal error1')
        } else if (!user) {
          res.status(401).send('Incorect email')
        } else {
          user.isCorrectPassword(password, (err, right) => {
            if (err) {
              res.status(500).send('Internal error')
            } else if (!right) {
              console.log(right)
              res.status(401).send('Incorect email or password')
            } else {
              // Issue token
              const payload = { email }
              const token = jwt.sign(payload, secret, {
                expiresIn: '1h'
              })
              console.log('tokenLL', token)
              // res.cookie('token', token, { httpOnly: true }).sendStatus(200);
              res.json({
                token: token
              })
            }
          })
        }
      })
    })

    // For secure path, request will get verifyso that only 
    // authorize user can sign in 
    const chkToken = (req, res, next) => {
      const token =
        req.body.token || req.query.token || req.headers['x-access-token']
      console.log('DD', token)
      if (!token) {
        res.status(401).send('Unauthorised')
      } else {
        console.log('hre', token)
        jwt.verify(token, secret, (err, success) => {
          console.log('error', err)
          if (err) {
            res.status(401).send('Unauthorised')
          } else {
            res.status(200).send('authorised')
            req.email = success.email
            next()
          }
        })
      }
    }
    app.get('/checktoken', chkToken, (req, res) => {
      res.sendStatus(200)
    })


    // Endpoint for registering the new user
    app.post('/register', (req, res) => {
      const { email, password } = req.body
      let user = new User({ email, password })
      console.log(email)
      console.log(password)
      console.log(user)
      user.save(err => {
        console.log(err)
        if (err) {
          res.status(605).send('Internal error1')
        } else {
          res.status(200).send('Inserted')
        }
      })
    })

    // For checking our secure ports are working or not
    app.get('/secret', chkToken, function (req, res) {
      res.send('Welcome to Secret Component from Server')
    })

    // default page
    app.get('/', function (req, res) {
      res.send('Welcome to the home page')
    })

    // home page
    app.get('/home', function (req, res) {
      res.send('Welcome to the home page')
    })


    // To post the text, user latitude and longitude
    // will be stored in our database 
    app.post('/post', chkToken, function (req, res) {
      console.log('Welcome to post')

      const { long, lat } = req.body
      let post = new Post({ long, lat })
      post.save(err => {
        console.log(err)
        if (err) {
          res.status(605).send('Internal error1')
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
}

// calling our main function
main().catch(console.error)
