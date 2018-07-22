const mongoose = require('mongoose')

// short id needed to generate unique id before saving to mongo
// I was thinking of using mongo id, but i would have to save a
// mongo record, and then retrieve it before I can respond with the
// _id, so instead using shortid to generate _id before saving for
// less db calls
const shortid = require('shortid')
mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

var personSchema = new mongoose.Schema({
  _id: {type:String,default:shortid.generate},
  username: {type:String,required:true},
  exercises: {type:Array, required:false}
})

var Person = mongoose.model('Persons', personSchema);

exports.Person = Person;