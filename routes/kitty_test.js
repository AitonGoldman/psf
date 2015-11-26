var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');

var kittyHomeSchema = mongoose.Schema({
    name: String
})

var kittySchema = mongoose.Schema({
    name: String,
    kittyHome: { type: Schema.Types.ObjectId, ref: 'KittenHome' },
    kitty_history: {
	dateOfBirth: String,
	dateOfDeath: String
    },
    dateAdded : { type: Date, default: Date.now },
    listOfAliases: [String]
    
});

kittySchema.methods.speak = function () {
    var greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
    console.log(greeting);
}

kittySchema.virtual('pooping').get(function () {
    return this.name + ' pooped'
});

kittySchema.virtual('pooping').set(function (name) {
    var split = name.split(' ');
    this.name = name;
    this.listOfAliases.addToSet(name);

});

var KittenHome = mongoose.model('KittenHome', kittyHomeSchema);
var Kitten = mongoose.model('Kitten', kittySchema);

console.log('Started up!');

/* GET home page. */

router.get('/make', function(req,res,next){
    var fluffyHome = new KittenHome({name: "our house"});
    fluffyHome.save(function(err,flufHome){
	var fluffy = new Kitten({ name: 'fluffy' , kitty_history: {dateOfBirth: "then", dateOfDeath: "now"}, listOfAliases: ["mr kitty","mr bad kitty"], kittyHome: flufHome._id});
	fluffy.save(function (err, fluffys) {
	    if (err) return console.error(err);
	    console.log(fluffys.speak());
	    res.send('hi');	
	});
    })
})

router.get('/', function(req, res, next) {
    
    var query = Kitten.findOne({ 'name': 'fluffy' }).
    	where('listOfAliases').in(['mr kitty']);

    // selecting the `name` and `occupation` fields
    query.select('name pooping listOfAliases');

    // execute the query at a later time
    
    queryPromised = query.then(function (kitty) {
    	if(kitty === null){
    	    return {}
    	}
    	kitty.pooping = "that guy";
    	return kitty.save();
    }, function(data){
    	res.send("oops - "+data);	
    })


    findPromised = queryPromised.then(function(data){
    	return Kitten.findOne({ 'name': 'that guy' }).populate('kittyHome');
    })

    findPromised.then(function(new_kitty){
    	Kitten.remove({}, function(data){
    	    res.send(new_kitty);	
    	});
    })
});



module.exports = router;

