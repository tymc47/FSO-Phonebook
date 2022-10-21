require('dotenv').config();
const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const Person = require('./models/phonebook')

morgan.token('post-content', (request, response) => {
  return request.method === 'POST' ? 
    JSON.stringify(request.body) :
    ""
})

app.use(express.static('build'))
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-content'));

let phonebook = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const length = phonebook.length
 
  response.send(
    `<p>Phonebook has info for ${length} people</p>
    <p>${new Date}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id)
  Person.findById(id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id);
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end();
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing"
    })
  } 
  
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})