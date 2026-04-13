import express from 'express'
import morgan from 'morgan'
const app = express()

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
  }
]

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
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(person => person.id === request.params.id)
  if (person) {
    response.json()
  }
  else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  if (!person.hasOwnProperty('name')) {
    response.status(400).end('name is missing')
  }
  else if (!person.hasOwnProperty('number')) {
    response.status(400).end('number is missing')
  } else {
    const nameIsUnique = persons.find(p => p.name === person.name)
    if (nameIsUnique) {
      response.status(400).end('name must be unique')
    } else {
      person.id = Math.floor(Math.random() * 200000).toString()
      persons = persons.concat(person)
      response.json(person)
    }
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