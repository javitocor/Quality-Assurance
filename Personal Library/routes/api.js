'use strict';
require('dotenv').config();
var expect = require('chai').expect;
const mongoose = require('mongoose')
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

var Schema = mongoose.Schema;
var BookSchema = new Schema(
  {
    title: { type: String, required: true },
    comments: [String]
  }
);
const Book = mongoose.model("Book", BookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      try {
        let arrayOfBooks = []
        Book.find(
          {},
          (error, results) => {
            if (!error && results) {
              results.forEach((result) => {
                let book = result.toJSON()
                book['commentcount'] = book.comments.length
                arrayOfBooks.push(book)
              })
              return res.json(arrayOfBooks)
            }
          }
        )
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      try {
        var title = req.body.title;
        if (!title) {
          return res.json('missing title')
        }
        let book = new Book({
          title: title,
          comments: []
        })
        await book.save(function (err) {
          if (err) return console.error(err);
          res.json({
            title: book.title,
            _id: book._id
          })
        });
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
    })

    .delete(async function (req, res) {
      try {
        await Book.deleteMany({}, function (err, books) {
          if (err) {
            res.send('could not delete all books');
          }
          else {
            res.send('complete delete successful');
          }
        });
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        var bookid = req.params.id;
        let book = await Book.find({ _id: bookid });
        if (!book) {
          res.json('no book exists');
        } else {
          res.json(book);
        }
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      try {
        var bookid = req.params.id;
        var comment = req.body.comment;
        await Book.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true }, function (err, book) {
          if (err) {
            return console.log(err);
          }
          if (!book) {
            res.send('no book exists');
          } else {
            res.json(book);
          }
        })
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
      //json res format same as .get
    })

    .delete(async function (req, res) {
      try {
        var bookid = req.params.id;
        await Book.findByIdAndDelete(bookid, function (err, book) {
          if (err) {
            res.send('could not delete ' + bookid);
          }
          else {
            if (!book) {
              res.send('no book exists');
            } else {
              res.send('delete successful');
            }
          }
        });
      } catch (err) {
        console.error(err)
        res.status(500).json('Server erorr...')
      }
      //if successful response will be 'delete successful'
    });

};
