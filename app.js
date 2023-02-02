// npm install -g nodemon
// used to start server like: nodemon app.js

// npm install express
// https://expressjs.com/

// npm install ejs
// https://ejs.co/

const express = require('express');
var fs = require("fs")

// express app
const app = express();

// listen for requests
app.listen(3000);

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
// looks for `public` directory and makes everything available from there
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    // renders views/index.ejs
    res.redirect('/home');
});

app.get('/finder', (req, res) => {
    console.log("get /finder");
    res.render('finder', { found: [] });
});

app.post('/finder', (req, res) => {
    console.log("post /finder");

    let item = req.body
    console.log(item);

    const jsonString = fs.readFileSync("public/products.json");
    var products = JSON.parse(jsonString);

    var found_products = [];
    for (let product of products) {
        //console.log(product);
        if (product.name.includes(item.productName)) {
            console.log(product);
            found_products.push(product);
        }
    }

    // Siin tehakse variable `found`, mille sees on kõik leitud tooted.
    // Neid andmeid kasutatakse finder.ejs sees, et kasutajale genereerida tabel toodetega.
    // finder.ejs on html siis pandud JS koodi, mis seda genereerimist teeb.
    // vaata kuidas `<table>` asjad finder.ejs sees v2lja n2evad
    res.render('finder', { found: found_products });
});

app.get('/home', (req, res) => {
    // renders views/index.ejs
    res.render('home');
});

app.get('/filler', (req, res) => {
    // renders views/index.ejs
    res.render('filler');
});


// app.get('/about', (req, res) => {
//   res.sendFile('./views/about.html', { root: __dirname });
// });

// check `index.ejs`, there is: <form action="/add-item" method="POST">
// if button is clicked, `form` data is posted to our server and it is handled here
app.post('/add-item', (req, res) => {
    let item = req.body
    console.log(item);

    const jsonString = fs.readFileSync("public/products.json");
    // convert string to JS objects
    var products = JSON.parse(jsonString);

    var maxid = 0
    for (let product of products) {
        //console.log(product);
        if (product.id > maxid) {
            maxid = product.id;
        }
    }

    var newProduct = {
        "id": maxid + 1,
        "image": item.productImage,
        "name": item.productName,
        "price": item.productPrice,
        "inventory": item.productQuantity,
        "productCode": item.productLocation
    };

    // push new product to the end of the products list
    products.push(newProduct);

    // convert JS object to a string so it can be written to a file
    const jsonNewString = JSON.stringify(products);
    // overwrite json file with new data
    fs.writeFileSync("public/products.json", jsonNewString);

    // go back to index.ejs
    res.redirect('/');
});

// 404 page
app.use((req, res) => {
    console.log("404");
    //res.status(404).sendFile('./views/404.html', { root: __dirname });

    // renders views/404.ejs
    res.status(404).render('404');
});
