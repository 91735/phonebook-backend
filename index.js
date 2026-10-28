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
  .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
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

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  if (!name) {
    response.status(400).end('name is missing')
  }
  else if (!number) {
    response.status(400).end('number is missing')
  } else {
    Person.find({ name }).then(result => {
      if (result.length !== 0) {
        response.status(400).end('name must be unique')
      } else {
        const newPerson = new Person({
          name,
          number
        })
        newPerson.save().then(savedPerson => {
          response.json(savedPerson)
        })
      }
    })
    .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      person.name = name
      person.number = number

      return person.save().then(person => {
        response.json(person)
      })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})