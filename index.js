import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import { Person } from './models/Person.js'

const app = express()

app.use(express.json())
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// app.get('/api/persons/:id', (request, response) => {
//   const person = Person.find(person => person.id === request.params.id)
//   if (person) {
//     response.json()
//   }
//   else {
//     response.status(404).end()
//   }
// })

app.post('/api/persons', (request, response) => {
  const person = request.body
  if (!person.hasOwnProperty('name')) {
    response.status(400).end('name is missing')
  }
  else if (!person.hasOwnProperty('number')) {
    response.status(400).end('number is missing')
  } else {
    Person.find({ name: person.name }).then(result => {
      if (result.length !== 0) {
        response.status(400).end('name must be unique')
      } else {
        const newPerson = new Person({
          name: person.name,
          number: person.number
        })
        newPerson.save().then(savedPerson => {
          response.json(savedPerson)
        })
      }
    })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})