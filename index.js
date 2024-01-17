import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import axios from "axios";

const app = express();
 

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/bookdB');
// }

// Set up default mongoose connection
mongoose.connect("mongodb+srv://coltravi:StK29w2fHgsidSE2@cluster0.kuzhpg3.mongodb.net/bookdB");

const bookSchema = new mongoose.Schema({
    title: String,
    summary: String,
    author: String,
    isbn: Number
  });

  const Book = mongoose.model('Book', bookSchema);
  
app.get("/", function(req, res){

Book.find({}).then(function(books){
  res.render("index.ejs", {books} );

});
});


app.get("/edit/:_id", function(req, res){
  Book.findById({ _id: new mongoose.Types.ObjectId(req.params._id) }).then(function(foundBook){
    res.render("edit.ejs", {foundBook} );
  }).catch(function(err){
    console.log(err);
  });    
  });

app.get("/add", function(req,res){
  res.render("add.ejs")
  });
  
app.post("/compose", function(req, res){
console.log(req.body.data);

Book.findOne({ title: req.body.title }).then(function(foundTitle){
  if (! foundTitle){
      console.log("doesnt exist");
      console.log(foundTitle);
      const book1 = new Book({ 
        title: req.body.title,
        summary: req.body.summary,
        author: req.body.author,
        isbn: req.body.isbn
      });
      book1.save();
 
      res.redirect("/");
          }
          else {console.log("exists");}
  }).catch(function(err){
console.log(err);
});
});

app.post("/edit/post/:_id", function(req, res){
  console.log(req.body);

 const update = (req.params._id);
  Book.findByIdAndUpdate({_id : new mongoose.Types.ObjectId(update)},
  {summary: req.body.summary, title: req.body.title, author: req.body.author })
    .then((foundEditBook) => {
    console.log(foundEditBook);
    console.log("saved");
    res.redirect("/" );
    }).catch((err) => {
      console.log(err);
    });
  });

app.get("/delete/:_id", function(req, res){
  console.log(req.params._id);
  const deleteId = req.params._id;

Book.deleteOne( { _id: deleteId}).then(function(){
  console.log("Successfully deleted!");
  res.redirect("/")
}).catch(function(err){
console.log(err);
 res.redirect("/")
});
});
     
let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

// Start the server at Port 3000
app.listen(port, function () {
  console.log("Server started successfully.");
});