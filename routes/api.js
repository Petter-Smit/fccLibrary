/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../models/books.js');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try{const allBooks = await Book.find();
        let booksOut = allBooks.map(book => {
            return ({'title': book.title, '_id': book.id, 'commentcount': book.commentcount});
            });
        res.json(booksOut);
         } catch(err) {console.log(err.message)};
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
    try{
      if (!title) {
        res.send("missing required field title");
      } else {
        const newBook = new Book({'title': title});
        const insertedBook = await newBook.save();
        const returnBook = {title: insertedBook['title'], _id: insertedBook['_id']};
        res.send(returnBook);
      }
    } catch(err){
      console.log(err);
    }})
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try{
        await Book.deleteMany({}, (err) => {
          if (err) {
            console.log(err.message);
          } else {
            res.send('complete delete successful');
          }
        });
      }catch(err){console.log(err.message)}
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try{
        let foundBook = await Book.find({'_id': bookid});
        if (foundBook.length === 0){
          res.send('no book exists');
        } else {
          res.json({title: foundBook[0].title, _id: foundBook[0]._id, comments: foundBook[0].comments});
        }
      }catch(err){console.log('something wrong getting single book', err)}
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        res.send('missing required field comment');
      } else {
        try{
          let foundBook = await Book.find({_id: bookid});
          if (foundBook.length === 0){
            res.send('no book exists');
          } else {
            foundBook = foundBook[0];
            foundBook.comments.push(comment);
            foundBook.commentcount += 1;
            let updatedBook = await foundBook.save();
            res.json({title: updatedBook.title, _id: updatedBook._id, comments: updatedBook.comments});
          }
        } catch(err) {console.log(err.message);}
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try{
        const foundBook = await Book.find({_id: bookid});
        if (foundBook.length === 0) {
          res.send('no book exists');
        } else {
          const deletedBook = await Book.findByIdAndDelete(bookid);
          res.send('delete successful');
        }
      } catch(err) {console.log(err.message);}
    });
  
};
