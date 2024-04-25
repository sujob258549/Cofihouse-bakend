const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER , process.env.DB_PASS)



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.aasa6jh.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

const uri = "mongodb+srv://cofiHouse:Sb807vTGG5GnthYi@atlascluster.aasa6jh.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coficolection = client.db('coffedb').collection('coffee')

        app.post('/coffee', async (req, res) => {
            const newcoffee = req.body;
            console.log(newcoffee)
            const result = await coficolection.insertOne(newcoffee)
            res.send(result)
        })

        app.get('/coffee', async (req, res) => {
            const cursor = coficolection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coficolection.deleteOne(query);
            res.send(result)
        })

        // update

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coficolection.findOne(query)
            res.send(result)
        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatecoffee = req.body;
            const coffee = {
                $set: {
                    name: updatecoffee.name,
                    chef: updatecoffee.chef,
                    supplier: updatecoffee.supplier,
                    taste: updatecoffee.taste,
                    category: updatecoffee.category,
                    prise: updatecoffee.prise,
                    photourl: updatecoffee.photourl

                }
            }
            const result = await coficolection.updateOne(filter, coffee, options);
            res.send(result)

        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})