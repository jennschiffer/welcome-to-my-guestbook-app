// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite stuff
var fs = require('fs');
var dbFile = './.data/guestbook.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if db does not exist, create it with our .env credentials
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE GuestbookRecords (name TEXT, twitter TEXT, message TEXT)');
    console.log('New table GuestbookRecords created!');
  }
  else {
    console.log('Database "GuestbookRecords" ready to go!');
    
    // print out every row so far just so we know it's being saved!
    db.each('SELECT * from GuestbookRecords', function(err, row) {
      console.log('record:', row);
    });
  }
})

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// and endpoint to hit when submitting guestbook form data
app.post('/postToGuestbook', function(request, response) {

  db.serialize(function() {
    // insert our guestbook record submitted into the database
    var values = `('${request.body.name}', '${request.body.twitter}', '${request.body.message}')`;
    db.run('INSERT INTO GuestbookRecords (name, twitter, message) VALUES ' + values); 
    console.log('values inserted: ', values)
  });
})

// add endpoint to hit when getting guestbook db entries, and send back to client
// to add to the table
app.get('/getGuestbookEntries', function(request, response) {
  db.all('SELECT * from GuestbookRecords', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
