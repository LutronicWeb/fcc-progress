/**********************************************
* 3. FCC Mongo & Mongoose Challenges
* ==================================
***********************************************/

/** # MONGOOSE SETUP #
/*  ================== */

/** 1) Install & Set up mongoose */

// Add `mongodb` and `mongoose` to the project's `package.json`. Then require 
// `mongoose`. Store your **mLab** database URI in the private `.env` file 
// as `MONGO_URI`. Connect to the database using `mongoose.connect(<Your URI>)`
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

/** # SCHEMAS and MODELS #
/*  ====================== */

/** 2) Create a 'Person' Model */

// First of all we need a **Schema**. Each schema maps to a MongoDB collection
// and defines the shape of the documents within that collection. Schemas are
// building block for Models. They can be nested to create complex models,
// but in this case we'll keep things simple. A model allows you to create
// instances of your objects, called **documents**.

// Create a person having this prototype :

// - Person Prototype -
// --------------------
// name : string [required]
// age :  number
// favoriteFoods : array of strings (*)

// Use the mongoose basic *schema types*. If you want you can also add more
// fields, use simple validators like `required` or `unique`, and set
// `default` values. See the [mongoose docs](http://mongoosejs.com/docs/guide.html).

// <Your code here >

// Schema
var personSchema = new mongoose.Schema({
  name: {type: String,required: true},
  age: Number,
  favoriteFoods: [String]
});

// Model
var Person = mongoose.model('Person', personSchema);


// **Note**: GoMix is a real server, and in real servers interactions with
// the db are placed in handler functions, to be called when some event happens
// (e.g. someone hits an endpoint on your API). We'll follow the same approach
// in these exercises. The `done()` function is a callback that tells us that
// we can proceed after completing an asynchronous operation such as inserting,
// searching, updating or deleting. It's following the Node convention and
// should be called as `done(null, data)` on success, or `done(err)` on error.
// **Warning** - When interacting with remote services, **errors may occur** !

// - Example -
// var someFunc = function(done) {
//   ... do something (risky) ...
//   if(error) return done(error);
//   done(null, result);
// };

/** # [C]RUD part I - CREATE #
/*  ========================== */

/** 3) Create and Save a Person */

// Create a `document` instance using the `Person` constructor you build before.
// Pass to the constructor an object having the fields `name`, `age`,
// and `favoriteFoods`. Their types must be conformant to the ones in
// the Person `Schema`. Then call the method `document.save()` on the returned
// document instance, passing to it a callback using the Node convention.
// This is a common pattern, all the **CRUD** methods take a callback 
// function like this as the last argument.

// - Example -
// ...
// person.save(function(err, data) {
//    ...do your stuff here...
// });
//
// - Person Prototype -
// --------------------
// name : string [required]
// age :  number
// favoriteFoods : array of strings (*)

var createAndSavePerson = function(done) {
  var personObj = new Person({name: "Ted?", age: 60, favoriteFoods:["rabbit", "stew"]});
  personObj.save(function(err){
    if(err){
      console.log(err);
      return done(err);
    }
    else return done(null, personObj)
  });
};

/** 4) Create many People with `Model.create()` */

// Sometimes you need to create many Instances of your Models,
// e.g. when seeding a database with initial data. `Model.create()`
// takes an array of objects like [{name: 'John', ...}, {...}, ...],
// as the 1st argument, and saves them all in the db.
// Create many people using `Model.create()`, using the function argument
// 'arrayOfPeople'.

var folks = [{name: "Ted Nugent", age: 65, favoriteFoods:["chicken", "eggs"]},
             {name: "Marky Mark", age: 45, favoriteFoods:["Boston Cream Donut", "Milk"]},
             {name: "Mary Poppins", age: 100, favoriteFoods:["Chocolate"]},
             {name: "Ralph Nader", age: 72, favoriteFoods:["Beef", "Soy Beans","Wheat"]},
             {name: "Bob Dole", age: 83, favoriteFoods:["Taco Bell", "KFC"]},
            ]

// NOTES - arrayofpeople contains the objs accesible via arrayOfPeople[0].name ,etc
//       - data contains same info as array of people but it seems to be one big object
//       - not exactly sure whats going on there
//
//       - err = null when no error
var createManyPeople = function(arrayOfPeople, done) {
  Person.create(arrayOfPeople, function(err, data){
    if(err){
      return done(err);
    }
    else{
      return done(null,data);
    }
  });
};

/** # C[R]UD part II - READ #
/*  ========================= */

/** 5) Use `Model.find()` */

// Find all the people having a given name, using `Model.find() -> [Person]`
// In its simplest usage, `Model.find()` accepts a **query** document (a JSON
// object ) as the first argument, and returns an **array** of matches.
// It supports an extremely wide range of search options. Check it in the docs.
// Use the function argument `personName` as search key.

var findPeopleByName = function(personName, done) {
  console.log(personName);
  Person.find({name:personName}, function(err, data){
    console.log("data = " + data)
    if (err){
      return done(err);
    }
    else {return done(null,data)}
  })
};

/** 6) Use `Model.findOne()` */

// `Model.findOne()` behaves like `.find()`, but it returns **only one**
// document, even if there are more. It is especially useful
// when searching by properties that you have declared as unique.
// Find just one person which has a certain food in her favorites,
// using `Model.findOne() -> Person`. Use the function
// argument `food` as search key


// test data = "chicken salad"
var findOneByFood = function(food, done) {
  console.log("food = " + food);
  
  // NOTES: 
  // Person.where({favoriteFoods: [food]}).findOne(function(err, data){...
  // is equivalent to 
  // Person.findOne({favoriteFoods: [food]},function(err, data){...
  //
  // Also
  // {favoriteFoods: [food]} = {favoriteFoods: food}
  // not sure why all of the above notes are true
  Person.findOne({favoriteFoods: [food]},function(err, data){
    console.log("data = " + data)
    if (err){
      return done(err);
    }
    else {return done(null,data)};
  });
};

/** 7) Use `Model.findById()` */

// When saving a document, mongodb automatically add the field `_id`,
// and set it to a unique alphanumeric key. Searching by `_id` is an
// extremely frequent operation, so `moongose` provides a dedicated
// method for it. Find the (only!!) person having a certain Id,
// using `Model.findById() -> Person`.
// Use the function argument 'personId' as search key.

var findPersonById = function(personId, done) {
  //console.log("personId = " + personId);
  Person.findById({_id: personId}, function(err,data){
    //console.log("data = " + data)
    if(err){
       return done(err); 
    }
    console.log("done function = " + done(null,data));
    done(null,data);
  })
};

/** # CR[U]D part III - UPDATE # 
/*  ============================ */

/** 8) Classic Update : Find, Edit then Save */

// In the good old days this was what you needed to do if you wanted to edit
// a document and be able to use it somehow e.g. sending it back in a server
// response. Mongoose has a dedicated updating method : `Model.update()`,
// which is directly binded to the low-level mongo driver.
// It can bulk edit many documents matching certain criteria, but it doesn't
// pass the edited document to its callback, only a 'status' message.
// Furthermore it makes validation difficult, because it just
// direcly calls the mongodb driver.

// Find a person by Id ( use any of the above methods ) with the parameter
// `personId` as search key. Add "hamburger" to the list of her `favoriteFoods`
// (you can use Array.push()). Then - **inside the find callback** - `.save()`
// the updated `Person`.

// [*] Hint: This may be tricky if in your `Schema` you declared
// `favoriteFoods` as an `Array` without specifying the type (i.e. `[String]`).
// In that case `favoriteFoods` defaults to `Mixed` type, and you have to
// manually mark it as edited using `document.markModified('edited-field')`
// (http://mongoosejs.com/docs/schematypes.html - #Mixed )


// NOTES: you have to keep pushing data through the functions
var findEditThenSave = function(personId, done) {
  //console.log(personId);
  var foodToAdd = 'hamburger';
  //console.log(done);
  Person.findById({_id: personId}, function(err,data){
    console.log("data = " + data)
    data.favoriteFoods.push(foodToAdd);
    console.log("newData = " + data);
    data.save(function(err,data){
      if (err){return done(err)}
      else{return done(null,data)}
    });
  })
};

/** 9) New Update : Use `findOneAndUpdate()` */

// Recent versions of `mongoose` have methods to simplify documents updating.
// Some more advanced features (i.e. pre/post hooks, validation) beahve
// differently with this approach, so the 'Classic' method is still useful in
// many situations. `findByIdAndUpdate()` can be used when searching by Id.
//
// Find a person by `name` and set her age to `20`. Use the function parameter
// `personName` as search key.
//
// Hint: We want you to return the **updated** document. In order to do that
// you need to pass the options document `{ new: true }` as the 3rd argument
// to `findOneAndUpdate()`. By default the method
// passes the unmodified object to its callback.


// straight up mongodb documentation required, all prior challenges sovled via mongoose docs
var findAndUpdate = function(personName, done) {
  
  var ageToSet = 20;
  Person.findOneAndUpdate({name: personName},{$set: {age: ageToSet}},{new: true},function(err, data){
    console.log(data)
    if(err){return done(err)}
    else return done(null,data)
  });
};

/** # CRU[D] part IV - DELETE #
/*  =========================== */

/** 10) Delete one Person */

// Delete one person by her `_id`. You should use one of the methods
// `findByIdAndRemove()` or `findOneAndRemove()`. They are similar to the
// previous update methods. They pass the removed document to the cb.
// As usual, use the function argument `personId` as search key.

var removeById = function(personId, done) {
  Person.findByIdAndRemove({_id: personId},(err,data)=>{
  if(err) return done(err)
  else return done(null,data)})
};

/** 11) Delete many People */

// `Model.remove()` is useful to delete all the documents matching given criteria.
// Delete all the people whose name is "Mary", using `Model.remove()`.
// Pass to it a query ducument with the "name" field set, and of course a callback.
//
// Note: `Model.remove()` doesn't return the removed document, but a document
// containing the outcome of the operation, and the number of items affected.
// Don't forget to pass it to the `done()` callback, since we use it in tests.

var removeManyPeople = function(done) {
  var nameToRemove = "Mary";
  Person.remove({name: "Mary"},(err,data)=>{
  if (err) return done(err)
  else return done(null,data)})
};

/** # C[R]UD part V -  More about Queries # 
/*  ======================================= */

/** 12) Chain Query helpers */

// If you don't pass the `callback` as the last argument to `Model.find()`
// (or to the other similar search methods introduced before), the query is
// not executed, and can even be stored in a variable for later use.
// This kind of object enables you to build up a query using chaining syntax.
// The actual db search is executed when you finally chain
// the method `.exec()`, passing your callback to it.
// There are many query helpers, here we'll use the most 'famous' ones.

// Find people who like "burrito". Sort them alphabetically by name,
// Limit the results to two documents, and hide their age.
// Chain `.find()`, `.sort()`, `.limit()`, `.select()`, and then `.exec()`,
// passing the `done(err, data)` callback to it.

var queryChain = function(done) {
  var foodToSearch = "burrito";
  var query = Person.find({favoriteFoods:foodToSearch}).sort({name: 'asc'}).limit(2).select("-age")
  query.exec((err,data)=>{
    console.log(data)
    if(err) return done(err)
    else return done(null,data)
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

/** # Further Readings... #
/*  ======================= */
// If you are eager to learn and want to go deeper, You may look at :
// * Indexes ( very important for query efficiency ),
// * Pre/Post hooks,
// * Validation,
// * Schema Virtuals and  Model, Static, and Instance methods,
// * and much more in the [mongoose docs](http://mongoosejs.com/docs/)


//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
