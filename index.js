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
  Person.find({})
  .then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
  .then(person => {
    if(person){
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id).then(result => {
    response.status(204).end();
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })
  
  return person.save()
  .then(savedPerson => response.json(savedPerson))
  .catch(err => next(err))
    
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id

   
  const person = {
    name: body.name,
    number: body.number
  }

  return Person.findByIdAndUpdate(id, person, { new : true, runValidators: true, context: 'query' })
  .then(updated => response.json(updated))
  .catch(err => next(err))

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error : 'malformatted id'})
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})