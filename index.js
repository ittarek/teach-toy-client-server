const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const app = express("app");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hi7rjxl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // database collection
    const roboticToyCollection = client.db("techToyDataBase").collection("Toy");
    const futureToyCollection = client
      .db("techToyDataBase")
      .collection("futureToys");
    const addToyCollection = client.db("techToyDataBase").collection("addToy");

    //    robotic toy date get
    app.get("/roboticToy", async (req, res) => {
      const result = await roboticToyCollection.find().toArray();
      res.send(result);
    });

    //     future toy data get
    app.get("/futureToys", async (req, res) => {
      const result = await futureToyCollection.find().toArray();
      res.send(result);
    });

    // add toy data by post method
    app.post("/addToy", async (req, res) => {
      const toysData = req.body;
      //       console.log(toysData);
      const result = await addToyCollection.insertOne(toysData);
      res.send(result);
    });

    //     get All toy data from database by get method
    app.get("/allToy", async (req, res) => {
      const result = await addToyCollection.find().toArray();
      res.send(result);
    });

    //     get data for my toy page by user email

    app.get("/myToy/:email", async (req, res) => {
      const toys = await addToyCollection
        .find({
          sellerMail: req.params.email,
        })
        .toArray();
      res.send(toys);
    });

    //     update toy data from my toy page
    app.put("/updateToy/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateItem = {
        $set: {
          price: body.price,
          quantity: body.quantity,
          description: body.description,
        },
      };
      const result = await addToyCollection.updateOne(filter, updateItem ,options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("teach toy server is running");
});

app.listen(port, () => {
  console.log(`tech toys server in running port : ${port}`);
});
