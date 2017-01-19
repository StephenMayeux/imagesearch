require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
//var imagesearch = require('node-google-image-search');
var path = require('path');
var app = express();

//Set static path
app.use(express.static(__dirname + '/public'));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://localhost/image_search');

var querySchema = new mongoose.Schema({
    termsearch: String,
    when: Date
});
var history = mongoose.model('History', querySchema);

var GoogleSearch = require('google-search');


var googleSearch = new GoogleSearch({
  key: 'AIzaSyBnrMdXiv60nRizpElDb3QECo8QSscnSqg',
  cx: '000754867127125657108:bxeoqm_9f20'
});

app.get('/', function(req, res){
    res.send('New Project!!');
});


app.get('/:searchable', function(req, res){

    var item = req.params.searchable;

    history.create({
        termsearch: item,
        when: new Date()
    });

    googleSearch.build(
    {
        q: item,
        //start: 2,
        num: 10
    }, function(err, response){
        if (err){
            console.log(err);
        }else{
            //res.send(result);
            var result = [];
             var searchNum = response.queries.request[0].count
             for(var i = 0; i < searchNum; i++){
               var selection = response.items[i];
               var newObj = {
                        "title": selection.title,
                        "snippet": selection.snippet,
                        "imgUrl": selection.link,
                };
              result.push(newObj);
             }
             //res.send(response);
             res.send(result);
        }
    });
});


app.listen(3000, function(){
    console.log("Server running on port 3000");
});
