const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

    const personSchema = new mongoose.Schema({
      name: {
          type: String,
          minLength: 3,
          required: true
      },
      number: {
          type: String,
          validate: {
            validator: (v) => {
              if(v.length < 8) return false;
              if(!v.includes("-")) return false;
              const [country, number] = v.split("-");
              if(country.length < 2 || country.length > 3) return false;
              if(!/^\d+$/.test(country) || !/^\d+$/.test(number)) return false;

              return true;
            },
            message: props => `${props.value} is not a valid phone number`
          },
          required: true
      }
  })


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)