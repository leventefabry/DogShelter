var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    app             = express();
    
mongoose.connect("mongodb://localhost/dog_adoption");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var dogSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: Number,
    neutered: Boolean,
    description: String,
    image: String,
    created: {type: Date, default: Date.now}
});
var Dog = mongoose.model("Dog", dogSchema);

// === LANDING PAGE ===
app.get("/", function(req, res){
    res.redirect("/dogs");
});

// === LIST OF DOGS ===
app.get("/dogs", function(req, res){
    Dog.find({}, function(err, dogs){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {dogs: dogs});
        }
    })
});

// === NEW DOG ===
app.get("/dogs/new", function(req, res){
   res.render("new"); 
});

app.post("/dogs", function(req, res){
    Dog.create(req.body.dog, function(err, newDog){
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/dogs");
        }
    })
});

//=== SHOW DOG ===
app.get("/dogs/:id", function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if (err) {
            res.redirect("/dogs");
        }
        else {
            res.render("show", {dog: foundDog});
        }
    })
});

//=== EDIT DOG ===
app.get("/dogs/:id/edit", function(req, res) {
    Dog.findById(req.params.id, function(err, foundDog){
        if (err) {
            res.redirect("/dogs")
        }
        else {
            res.render("edit", {dog: foundDog});
        }
    })
});

app.put("/dogs/:id", function(req, res) {
    Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(err, updatedDog){
        if (err) {
            res.redirect("/dogs")
        }
        else {
            res.redirect("/dogs/" + req.params.id);
        }
    })
});

//=== DELETE DOG ===
app.delete("/dogs/:id", function(req, res){
    Dog.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/dogs");
        } else {
            res.redirect("/dogs");
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("DogShelter app server has started!");
});