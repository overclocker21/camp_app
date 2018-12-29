var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//compling above schema into a model
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "wefwef",
//     image: "https://media-cdn.tripadvisor.com/media/photo-s/02/21/71/43/campsite.jpg",
//     description: "Test description"
// }, function (err, newlyCreated) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(newlyCreated + " added");
//     }
// });

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    //get from DB:
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCampgrounds });
        }
    });
});

app.post("/campgrounds", function (req, res) {
    //get data from form and add to campgrounds array and then redirect back to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc }

    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated + " added");
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});

app.get("/campgrounds/:id", function (req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template
            res.render("show", { campground: foundCampground });
        }
    });
});

app.listen(3000, function () {
    console.log("Yelp Camp Server has started!");

});