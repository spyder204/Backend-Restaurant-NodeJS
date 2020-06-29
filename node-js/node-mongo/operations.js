// encapsulating database ops(4) into a node module of its own
// use this in node app to interact with the server

const assert = require('assert');
exports.insertDocument=(db, document, collection, callback) => {
//   doc into >collection> db
  const coll=db.collection(collection);
  return coll.insert(document);/*, (err, result)=>  // mongoDB driver funtion
  {
      assert.equal(err, null);
      console.log("Inserted "+result.result.n+" doc into the collection"+collection);// result prop. has a prop n that shows no. of insertions
      callback(result);

  });*/

};

exports.findDocuments=(db, collection, callback)=>{
  const coll=db.collection(collection);
  return coll.find({}).toArray();/*(err, docs)=>{ // mongoDB driver funtion
    assert.equal(err, null);
    callback(docs);
  });*/

};

exports.removeDocument=(db, document, collection, callback)=>{
  const coll=db.collection(collection);
  return coll.deleteOne(document);/*, (err,result)=>{ // mongoDB driver funtion
    assert.equal(err, null);
    console.log('Document removed',document);
    callback(result);
  });
*/
};

exports.updateDocument=(db, document, update, collection, callback)=>{
  const coll=db.collection(collection);
  return coll.updateOne(document);/*, { $set :update }, null, (err, result)=>{
    assert.equal(err, null);
    console.log('Document updated with', update);
    callback(result);
  });
// can add more methods too
*/
};
