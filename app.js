var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bing = require('node-bing-api')({ accKey: '6b9500bbbd7d4fb781649cd78a41b28b'});

var searchTerm = require('./models/searchTerm');
var app = express();
app.use(bodyParser.json());

var url = 'mongodb://neochong:test1234@ds143071.mlab.com:43071/fcc-project/searchterms';
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.Promise = global.Promise;
mongoose.connect(url, options);
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // Wait for the database connection to establish, then start the app.
});

app.get('/api/imagesearch/:val*', function(req,res) {
  var searchVal = req.params.val;
  var offset = req.query.offset;
  var sOffset = 0;
  var data = new searchTerm({
    searchVal,
  })

  data.save(function(err) {
    if (err) {
      return res.send('Error saving to database');
    }
  });

  if(offset ) {
    sOffset = offset;
  }

  Bing.images(searchVal, {
    top: 10,
    skip: sOffset
  }, function(error,response,body) {
    /*var bingData = [];
      for(var i=0;i<10;i++) {
        bingData.push({
          'url': body.value[i].contentUrl,
          'name': body.value[i].name,
          'snippet': body.value[i].thumbnailUrl,
          'context': body.value[i].hostPageUrl
        })
      }*/
    return res.json(body)
  })
});

app.get('/api/latest/imagesearch', function(req,res) {
  searchTerm.find({}, {searchVal:1,createdAt:1,_id:0}, function(err,data) {
    if(err) return res.send('error retrieving data')
    return res.json({
      data
    })
  }).sort({_id:-1}).limit(10);
});

app.listen(process.env.PORT || 3000, function() {
  console.log('app working!')
});
