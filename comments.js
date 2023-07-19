// Create web serverconst express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Create connection to database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

// Create schema
const commentSchema = new mongoose.Schema({
    name: String,
    email: String,
    comment: String
});

// Create model
const Comment = mongoose.model('Comment', commentSchema);

// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Use ejs
app.set('view engine', 'ejs');

// Set up static files
app.use(express.static(__dirname + '/public'));

// Render index.ejs
app.get('/', (req, res) => {
    res.render('index');
});

// Render comments.ejs
app.get('/comments', (req, res) => {
    Comment.find({}, (err, comments) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments', {comments: comments});
        }
    });
});

// Post comments
app.post('/comments', (req, res) => {
    let newComment = new Comment({
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment
    });

    Comment.create(newComment, (err, comment) => {
        if (err) {
            console.log(err);
        } else {
            console.log('New comment added to database');
            res.redirect('/comments');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});