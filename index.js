const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const app = express("app");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

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

    const roboticToyCollection = client.db("techToyDataBase").collection("Toy");
    const futureToyCollection = client.db("techToyDataBase").collection("futureToys");
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
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("teach toy server is running");
});

app.listen(port, () => {
  console.log(`tech toys server in running port : ${port}`);
});
