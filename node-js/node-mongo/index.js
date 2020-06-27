const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const db_oper=require('./operations');

// to start up a connection to mongoDB server
const url = 'mongodb://localhost:27017/'; //port number
const dbname='conFusion';// name of db  created using mongo shell

// to access the  server
mongoClient.connect(url, (err, client)=>{ // url, callback func

  assert.equal(err,null); // assert will check if the error is not null

  console.log('Connection successful');

  // connecting to the DB
  const db = client.db(dbname);
  const collection = db.collection('dishes');
//////////////
// nested set of callbacks

  db_oper.insertDocument(db, {name:"Vadonut", description:"test"}, 'dishes', (result)=>{
    console.log('Insert document:\n', result.ops);

    db_oper.findDocuments(db, 'dishes', (docs)=>{
      console.log('Found docs\n',docs);

      db_oper.updateDocument(db, {name:"Vadonut"}, {description: "updated test"}, 'dishes', (result)=>{
        console.log('Updated document\n', result.result);

        //find docs to delete
        db_oper.findDocuments(db, 'dishes', (docs)=>{
          console.log('Found docs- ',docs);
          db.dropCollection('dishes', (result)=>{
            console.log("Collection deleted ", result);
            client.close();

          });

          });
      });

  });
});



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
});  // url, callback func
