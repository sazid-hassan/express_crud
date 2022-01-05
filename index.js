const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectId;

const app = express();

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({ extended: false })
)

//un: khanZ pw: xR-_38zqGiUKJFg

const password = "xR-_38zqGiUKJFg"

app.listen(3100);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
})

const uri = "mongodb+srv://khanZ:xR-_38zqGiUKJFg@cluster0.cjree.mongodb.net/orgDB?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productCollection = client.db("orgDB").collection("products");


    app.get("/products", (req, res) => {
        productCollection.find({})
            .toArray((err, documnets) => {
                res.send(documnets)
            })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, documnets) => {
                res.send(documnets[0]);
            }
            )
    })

    app.post("/addProduct", (req, res) => {

        const product = req.body;

        productCollection.insertOne(product)
            .then(result => {
                console.log("Product added");
                res.redirect('/');
            });
    })

    app.patch("/update/:id", (req, res) => {
        productCollection.updateOne(
            { _id: ObjectID(req.params.id) },
            {
                $set: { name: req.body.name, price: req.body.price }
            }
        )
            .then(result => {
                res.send(result.modifiedCount > 0);
            })

    })

    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })

    })
});
