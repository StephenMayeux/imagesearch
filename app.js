require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var GoogleSearch = require('google-search');
var path = require('path');
var app = express();

//Set static path
app.use(express.static(__dirname + '/public'));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/image_search');

var querySchema = new mongoose.Schema({
    termsearch: String,
    when: Date
});

// keep model names Uppercase
var History = mongoose.model('History', querySchema);


var googleSearch = new GoogleSearch({
  key: 'AIzaSyBnrMdXiv60nRizpElDb3QECo8QSscnSqg',
  cx: '000754867127125657108:bxeoqm_9f20'
});

app.get('/', function(req, res, next){
    res.send('New Project!!');
});


app.get('/:searchable', function(req, res, next){

    var item = req.params.searchable;

    var history = new History({
        termsearch: item,
        when: new Date()
    });

    history.save(function(err) {
      if (err) return next(err);
    });

    googleSearch.build({
      q: item,
      num: 10
    }, function(err, response) {
      if (err) return next(err);
      var results = response.items.map(function(image) {
        return {
          title: image.title,
          snippet: image.snippet,
          imgUrl: image.link
        };
      });
       res.send(results);
    });
});


app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});
