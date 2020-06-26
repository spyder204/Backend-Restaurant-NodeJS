const express=require('express');
const http=require('http');
const morgan=require('morgan');
const hostname='localhost';
const port=3000;

const bodyParser=require('body-parser');
const app=express(); // saying that the app is going to use the express node module

app.use(morgan('dev'));// development version- so it will print out additionalinfo to the screen

app.use(bodyParser.json());// body od incoming req is added to the body of req object

//building up REST API support for /dishes endpoint
app.all('/dishes', (req, res, next)=>
{
  // no matter GET PUT POST DELETE, executed first
  res.statusCode=200; // modifying res obj  here and in next line
  res.setHeader('Content-type', 'text/plain'); // sending plain text replies to the client

  next();
      // continues to look additional specs down below which matches /dishes endpoint
      // if we receive a GET req at /dishes endpoint, req and would be passed on down below
      // and app.get will be executed
});

app.get('/dishes',(req, res, next)=>{ // res object modified in app.all is the parameter here
  res.end('will send all the dishes to you');

});

app.post('/dishes', (req, res, next)=>{  // runs after app.all if there is a POST require
  res.end('will add to the dish: '+req.body.name+' with details '+req.body.description ); // name present in body prop in req obj
});// post means that you are posting a new dish to the server so a PUT does not make sense

app.put('/dishes', (req, res, next)=>{
  res.statusCode=403; //means operation not supported
  res.end('PUT operation not supported on dishes');
});
app.delete('/dishes', (req, res, next)=>{
  res.end('deleting all the dishes'); // dangerous operation, need admin privileges- will do it later
});

// doing for dish/:dishID endpoint
app.get('/dishes/:dishID',(req, res, next)=>{ // res object modified in app.all is the parameter here
  res.end(`will send the dish ${req.params.dishID} to you`);

});

app.post('/dishes/:dishID', (req, res, next)=>{  // runs after app.all if there is a POST require
  res.statusCode=403; //means operation not supported on a particular dish
  res.end('POST operation not supported on dishes');});

app.put('/dishes/:dishID', (req, res, next)=>{  //means modifying a specific dish
  //res.statusCode=403; //means operation not supported
  res.write(`updating the dish ${req.params.dishID}\n`);// used to add a line to the reply message
  res.end(`will update the dish ${req.body.name} with ${req.body.description}`);
});
app.delete('/dishes/:dishID', (req, res, next)=>{
  res.end('deleting the dish'+req.params.dishID); // dangerous operation, need admin privileges- will do it later
});


app.use(express.static(__dirname+'/public')) // tells express to serve static files
// informing express to look at this specific folder

//setting up EXPRESS server using express methods
app.use((req, res, next)=>   // next(optional)- is used when we use additional middleware
{
  //console.log(req.headers); -- no need to log entire headers as morgan will do it
  res.statusCode=200; //OK
  res.setHeader('Content-type','text/html');
  res.end('<html><body><p>this is an express server</p></body></html>');

});
//setting up NODE HTTP server
const server=http.createServer(app);

server.listen(port, hostname,()=>{
  console.log(`server running at http://${hostname}:${port}`);
});
// by default- it will server the index.html file
