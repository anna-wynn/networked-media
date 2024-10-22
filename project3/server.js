// follow classDemo 12

const express = require('express');
const app = express();
const path = require('path');
const parser = require('body-parser');
const multer = require('multer');
const encodedParser = parser.urlencoded({ extended: true });
const uploadProcessor = multer({ dest: 'public/upload' }); 


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(encodedParser);


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/galleryPage', (req, res) => {
    res.render('galleryPage'); 
});

app.get('/reviews', (req, res) => {
    res.render('reviews');
});

app.get('/favourites', (req, res) => {
    res.render('favourites');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/writereview', (req, res) => {
    res.render('writereview');
});


let data = [];
let postNum = 0;


app.get('/posts', (req, res) => {
    res.render('posts', { arrayToBeSent: data });
});


app.post('/upload', uploadProcessor.single('theimage'), (req, res) => {
    let now = new Date();
    
    
    let message = {
        text: req.body.text,
        date: now.toLocaleString(),
        postNumber: postNum++ 
    };

   
    if (req.file) {
        message.imgSrc = 'upload/' + req.file.filename;
    }

    
    data.unshift(message);
    res.redirect('/posts');  
});


app.get('/delete', (req, res) => {
    data = data.filter(d => d.postNumber != req.query.postId);
    res.redirect('/posts');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
