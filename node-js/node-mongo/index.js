const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dboper=require('./operations');

// to start up a connection to mongoDB server
const url = 'mongodb://localhost:27017/'; //port number
const dbname='conFusion';// name of db  created using mongo shell

// to access the  server
mongoClient.connect(url).then((client) => {

  console.log('Connected correctly to server');
  const db = client.db(dbname);

  dboper.insertDocument(db, { name: "Vadonut", description: "Test"},
      "dishes")
      .then((result) => {
          console.log("Insert Document:\n", result.ops);

          return dboper.findDocuments(db, "dishes");
      })
      .then((docs) => {
          console.log("Found Documents:\n", docs);

          return dboper.updateDocument(db, { name: "Vadonut" },
                  { description: "Updated Test" }, "dishes");

      })
      .then((result) => {
          console.log("Updated Document:\n", result.result);

          return dboper.findDocuments(db, "dishes");
      })
      .then((docs) => {
          console.log("Found Updated Documents:\n", docs);
                          
          return db.dropCollection("dishes");
      })
      .then((result) => {
          console.log("Dropped Collection: ", result);

          return client.close();
      })
      .catch((err) => console.log(err));

})
.catch((err) => console.log(err));;
//catching promises errors



/*
down below-- NOTE THE STRUCTURE-- NESTING OF CALLS
we are inserting a value and in the callback function we are doing operations like printing and deleting
the collection, to ensure that one operation is completed before we do the next one.
ONE INSIDE THE OTHER

*/
/*  collection.insertOne({"name":"momos", "description":"chinese"}, (err, result)=>{
        // insertOne has two params- document, callback function
            assert.equal(err,null);
            console.log('After insert\n');
            console.log(result.ops); // printing the operations carried out successfully-- eg- no. inserted is one i.e. doc has been inserted

            collection.find({}).toArray((err,docs)=>{
          //  looking for all the records in the collection-- no particular condition as the {} is empty
          // and is converting them to an toArray

            assert.equal(err, null);
            console.log('Found:\n');
            console.log(docs); // contains all the docs in the collection (as {} was empty)

            db.dropCollection('dishes', (err,result)=>{
            //removing dishes Collection
            assert.equal(err,null);
            client.close(); //connection to database closed
        });
    });
  });*/
  // url, callback func
