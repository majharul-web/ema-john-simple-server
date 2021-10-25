const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6soco.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        // connect database
        await client.connect();
        console.log('connection success');

        // create database and collection
        const database = client.db('emaJohn_Shop');
        const productsCollection = database.collection('products');

        app.get('/products', async (req, res) => {
            console.log(req.query);
            const cursor = productsCollection.find({});
            const count = await cursor.count();
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                const products = await cursor.toArray();
            }
            res.send({
                count,
                products
            });
        })


    }
    finally {
        //    await client.close;
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('ema john server running');
})

app.listen(port, () => {
    console.log(`ema-john-simple listening at http://localhost:${port}`)
})