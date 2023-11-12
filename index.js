const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

// middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('your server is running')
})



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.if4agm4.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.if4agm4.mongodb.net/?retryWrites=true&w=majority`;
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

    const productCollection = client.db('emaJhonDb').collection('products');



    app.get('/products', async (req, res) => {
      console.log(req.query)
      const page = parseInt(req.query.page) || 0;
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

      const skip = page * itemsPerPage;

      const result = await productCollection.find().skip(skip).limit(itemsPerPage).toArray();
      res.send(result)
    })

    app.post('/productsByIds', async (req, res) => {
      const ids = req.body;
      console.log(ids)
      const objectId = ids.map(id => new ObjectId(id))
      const query = {_id : {$in: objectId}}
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/totalProducts', async (req, res) => {
      const result = await productCollection.estimatedDocumentCount()
      res.send({ totalProducts: 52 })
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is listening on the port ${port}`)
})