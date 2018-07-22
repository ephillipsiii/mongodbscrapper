//setting up dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');
var request = require('request');
var cheerio = require('cheerio');

mongoose.Promise = Promise;

var port = process.env.PORT || 3000

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('public'));

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, "/views/layouts")
}));
app.set('view engine', 'handlebars');

// mongoose.connect('mongodb://localhost/mongoscraper');
// mongoose.connect('mongodb://nytimescrapper:a11111@ds245901.mlab.com:45901/nytimesscrapper')
// var db = mongoose.connection;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoscraper';
mongoose.Promise = Promise;
mongoose.connection(MONGODB_URI);

db.on('error', function(error) {
    console.log("Mongoose Error: ", error);
});

db.once('open', function(){
    console.log("Mongoose connection successful");
});

//routes!

app.get('/', function (req, res){
    Article.find({'saved': false}, function(error, data){
        var hbsObject = {
            article: data
        };
        console.log(hbsObject);
        res.render('home', hbsObject);
    });
});

app.get('/savedArticles', function(req, res){
    Article.find({'saved': true}).populate('notes').exec(function(error, articles){
        var hbsObject = {
            article: articles
        };
        res.render('savedArticles', hbsObject);
    });
});

//scraping!
app.get('/scrape', function (req, res) {
    request("https://www.nytimes.com/", function(error, response, html){
        var $ = cheerio.load(html);
        $('article').each(function(i, element){
            var result = {};
            result.title = $(this).children('h2').text();
            result.summary = $(this).children('.summary').text();
            result.link = $(this).children('h2').children('a').attr('href');

            var entry = new Article(result);

            entry.save(function(err, doc){
                if (err){
                    console.log(err);
                }
                else{
                    console.log(doc);
                }
            });
        });
        
        res.send("Scrape Finished!");
    });
});

//getting scraped articles
app.get('/articles', function(req, res){
    Article.find({}, function(error, doc){
        if (error){
            console.log(error);
        }
        else{
            res.json(doc);
        }
    });
});

//grabbin article by ObjectId
app.get('/articles/:id', function(req, res){
    Article.findOne({ _id: req.params.id})
    .populate('note')
    .exec(function(error, doc){
        if(error){
            console.log(error);
        }
        else{
            res.json(doc);
        }
    });
});

//saving article
app.post('/articles/save/:id', function(req, res){
    Article.findOneAndUpdate({_id: req.params.id}, {'saved': true})
    .exec(function(err, doc){
        if (err){
            console.log(err);
        }
        else {
            console.log("article saved");
            res.send(doc);
        }
    });
});

//deleting an article

app.post('/articles/delete/:id', function(req, res){
    Article.findOneAndUpdate({_id: req.params.id}, {'saved': false, 'notes': []})
    .exec(function(err, doc){
        if(err){
            console.log(err);
        }
        else{
            res.send(doc);
        }
    });
});

//making a n3ew note
app.post('/notes/save/:id', function(req, res){
    var newNote = new Note({
        body: req.body.text,
        article: req.params.id
    });
    console.log(req.body)
    newNote.save(function(error, note){
        if (error){
            console.log(error)
        }
        else{
            Article.findOneAndUpdate({_id: req.params.id}, {$push: {'notes': note}})
            .exec(function(err){
                if(err){
                    console.log(err);
                    res.send(err);
                }
                else{
                    res.send(note);
                }
            });
        }
    });
});

//deleting notes
app.delete('/notes/delete/:note_id/:article_id', function(req, res){
    Note.findOneAndRemove({'_id': req.params.note_id}, function(err){
        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            Article.findOneAndUpdate({'_id': req.params.article_id}, {$pull: {'notes': req.params.note_id}})
            .exec(function(err){
                if(err){
                    console.log(err);
                    res.send(err);
                }
                else{
                    res.send('Note Deleted');
                }
            });
        }
    });
});

//set that server!
app.listen(port, function(){
    console.log('App running on port ' + port);
})