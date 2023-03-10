/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let realID = '640b6e75e5cec9051b9b2723';
let fakeID = '111111222222333333456789';
let deleteID = '640b71099ed35f15e2fdfb83';

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */

  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });

  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server).post('/api/books').send({title: 'Harry Potter'}).end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'A title should exist');
          assert.equal(res.body.title, 'Harry Potter', 'The title should be correct');
          assert.property(res.body, '_id');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server).post('/api/books').send({comment: 'Harry Potter'}).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title', 'The message should be correct');
          done();
        });
      });
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server).get('/api/books').end((err, res) => {
          assert.equal(res.status, 200);
          assert.typeOf(res.body, 'array', 'We expect an array to be returned');
          assert.property(res.body[0], 'title', 'We expect the title field to be present');
          assert.property(res.body[0], 'commentcount', 'We expect the commentcount field to be present');
          assert.property(res.body[0], '_id', 'We expect the _id field to be present');
          done();
        })
      });      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server).get(`/api/books/${fakeID}`).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists', 'We expect this error message');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server).get(`/api/books/${realID}`).end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server).post(`/api/books/${realID}`).send({'comment': 'Hello there'}).end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'the title field should be present');
          assert.property(res.body, '_id', 'the _id field should be present');
          assert.property(res.body, 'comments', 'the comments field should be present');
          assert.typeOf(res.body.comments, 'array', 'the comments field should be an array');
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server).post(`/api/books/${realID}`).send({'aap': 'noot'}).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server).post(`/api/books/${fakeID}`).send({comment: 'Hello there'}).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
    });
    
    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server).delete(`/api/books/${deleteID}`).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        })
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai.request(server).delete(`/api/books/${fakeID}`).end((err, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });
    });
  });
});
