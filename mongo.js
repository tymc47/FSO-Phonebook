const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length === 4){
    console.log('If you would like to add another person, please provide the argument as node mongo.js <password> <name> <number>');
    process.exit(1)
}



const password = process.argv[2]
const url = `mongodb+srv://fullstackopen:${password}@cluster0.p3efzr2.mongodb.net/phonebookApp?retryWrites=true&w=majority`
const nameInput = process.argv[3]
const numberInput = process.argv[4]

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person =mongoose.model('Person', personSchema);


mongoose
    .connect(url)
    .then(result => {
        console.log("connected")

        if (process.argv.length === 5) {
            const person = new Person({
                name: nameInput,
                number: numberInput,
            })
        
            person.save().then((result) => {
                console.log(`added ${result.name} number ${result.number} to phonebook`)
                return mongoose.connection.close()
            })
        }
        
        if (process.argv.length === 3) {
            Person.find({}).then(result => {
                console.log('phonebook')
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })

                return mongoose.connection.close()
            })
        }
    })
    .catch((err) => console.log(err))

