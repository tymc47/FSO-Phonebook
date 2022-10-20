const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const app = express();

morgan.token('post-content', (request, response) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return ""
})

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
    response.json(phonebook)
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
  const person = phonebook.find(person => person.id === id)

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id);
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end();
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  
  if (!person || !person.name || !person.number) {
    return response.status(400).json({
      error: "name or number is missing"
    })
  } 
  
  if (phonebook.find(pp => pp.name.toLowerCase() === person.name.toLowerCase())) {
    return response.status(400).json({
      error: "name has to be unique"
    })
  }

  person.id = Math.round(Math.random()*1000000);

  phonebook = phonebook.concat(person);

  response.json(phonebook)
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})