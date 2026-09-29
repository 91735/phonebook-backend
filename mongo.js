import mongoose from 'mongoose'
const MONGODB = process.env.MONGODB

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = MONGODB

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String
})
const Person = mongoose.model('Person', personSchema)
if (password && !name) {
  console.log('phonebook:')
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
else {
  const person = new Person({
    name,
    number
  })

  person.save().then(result => {
    console.log(`Added: ${name} number: ${number} to phonebook`)
    mongoose.connection.close()
  })
}

