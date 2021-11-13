
const express = require('express');
const { MongoClient } = require('mongodb');


require('dotenv').config();
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000
const cors = require('cors')
// medilware
app.use(cors());
app.use(express.json());

// cannect uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n0kiz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);


async function run() {
  try {
    await client.connect();
    const database = client.db('bikeshop');
    const bikeCallection = database.collection('bike');
    const addBiketCallection = database.collection('addBike');
    const bookBiketCallection = database.collection('bookBike');
    const reviewCallection = database.collection('review');
    const usersCallection = database.collection('user');
    const clintCallection = database.collection('clint');



    // get api
    app.get('/bike', async (req, res) => {
      const cursor = bikeCallection.find({});
      const user = await cursor.toArray();

      res.send(user)

    });

    // get single
    app.get('/bike/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = {
        projection: { _id: 0 },
      };
      const result = await bikeCallection.findOne(query, options);
      res.send(result)
    });
//  post Api
    app.post('/addBike', async (req, res) => {
      const dile = req.body;
      const result = await addBiketCallection.insertOne(dile);
      res.json(result)

    })

    // get api 
    app.get('/addBike', async (req, res) => {
      const cursor = addBiketCallection.find({});
      const user = await cursor.toArray();
      res.send(user)

    });


    // get single
    app.get('/bookBike/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = {
        projection: { _id: 0 },
      };
      const result = await bookBiketCallection.findOne(query, options);
      res.send(result)
    });


    //  post Api for add to card

    app.post('/bookBike', async (req, res) => {
      const bike = req.body;
      const result = await bookBiketCallection.insertOne(bike);
      res.json(result)

    })

    /// get all
    app.get('/bookBike', async (req, res) => {
      const cursor = bookBiketCallection.find({});
      const user = await cursor.toArray();
      res.send(user)
    });

    // get Api

    app.get('/orderBike/:email', async (req, res) => {
      const email = req.params.email;
      const qurey = { email: email };
      console.log(qurey);
      const result = await bookBiketCallection.find(qurey).toArray();
      console.log(result);
      res.json(result);


    })

    // delete Api
    app.delete('/bookBike/:id', async (req, res) => {
      const bikeId = req.params.id;
      console.log(bikeId);
      const qurey = { _id: ObjectId(bikeId) };
      const result = await bookBiketCallection.deleteOne(qurey);
      res.json(result);


    })

    //  post Api
    app.post('/review', async (req, res) => {
      const dile = req.body;
      const result = await reviewCallection.insertOne(dile);

      res.json(result)

    });

    /// get all
    app.get('/review', async (req, res) => {
      const cursor = reviewCallection.find({});
      const user = await cursor.toArray();
      res.send(user)
    });
// add user info
    app.post("/addUserInfo", async (req, res) => {
      console.log("req.body");
      const result = await usersCallection.insertOne(req.body);
      res.send(result);

    });

// make Admin
    app.put("/makeAdmin", async (req, res) => {
      const filter = { email: req.body.email };
      const result = await usersCallection.find(filter).toArray();
      if (result) {
        const documents = await usersCallection.updateOne(filter, {
          $set: { role: "admin" },
        });


      }
      res.send(result)
    });

//chack Admin
    app.get("/checkAdmin/:email", async (req, res) => {
      const result = await usersCallection.find({ email: req.params.email })
        .toArray();
      res.send(result);
    });


// status update
    app.put("/bookBike/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id,req.body)
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: req.body.status,
        }
      }

      const result = await bookBiketCallection.updateOne(filter, updateDoc, options
      );
      res.json(result);
      console.log(result);
    });


    //get clint api 

    app.get('/clint', async (req, res) => {
      const cursor = clintCallection.find({});
      const user = await cursor.toArray();

      res.send(user)

    });

  }

  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('runing server 5000')
});
app.listen(port, () => {
  console.log('live server', port);
})