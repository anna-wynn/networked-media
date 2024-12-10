const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use(bodyParser.urlencoded({ extended: true }));

// multer to save imagesss
const upload = multer({ dest: path.join(__dirname, 'uploads/') }); 


const wishlistItems = []; 
const purchaseHistoryItems = []; 


app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/upload', (req, res) => {
    res.render('upload');
});

app.post('/upload', upload.single('itemImage'), (req, res) => {
    const { itemCaption, itemLink } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    if (!itemCaption || itemCaption.length < 200) {
        return res.status(400).send('Caption must be at least 200 characters long.');
    }

    if (!itemLink) {
        return res.status(400).send('Purchase link is required.');
    }

    const newItem = {
        imagePath: `/uploads/${file.filename}`, 
        caption: itemCaption,
        link: itemLink,
    };

    
    wishlistItems.push(newItem);

    
    purchaseHistoryItems.push({ imagePath: newItem.imagePath, purchased: false });

    console.log('Wishlist updated:', wishlistItems);
    console.log('Purchase history updated:', purchaseHistoryItems);

    
    res.redirect('/wishlist');
});


app.get('/wishlist', (req, res) => {
    res.render('wishlist', { items: wishlistItems }); 
});


app.get('/purchasehistory', (req, res) => {
    res.render('purchasehistory', { items: purchaseHistoryItems }); 
});


app.post('/purchasehistory/update', (req, res) => {
    const { index } = req.body;

    if (index === undefined || index < 0 || index >= purchaseHistoryItems.length) {
        return res.status(400).send('Invalid index');
    }

    
    purchaseHistoryItems[index].purchased = true;

    
    const imagePath = purchaseHistoryItems[index].imagePath; 
    const wishlistIndex = wishlistItems.findIndex(item => item.imagePath === imagePath);

    if (wishlistIndex !== -1) {
        wishlistItems.splice(wishlistIndex, 1); 
        console.log(`Removed item from wishlist: ${imagePath}`);
    }

    console.log('Updated purchase history:', purchaseHistoryItems);
    console.log('Updated wishlist:', wishlistItems);

    
    res.redirect('/thankyou');
});



app.get('/thankyou', (req, res) => {
    res.render('thankyou');
});



app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});
