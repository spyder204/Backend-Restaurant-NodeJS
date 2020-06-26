const http=require('http');
const hostname='localhost';
const port=3000;
const path=require('path');
const fs = require('fs'); // to read-write files
//setting up server
const server=http.createServer((req,res) => {
	console.log('Request for '+req.url+' by method '+req.method); // to access the headers in the incoming http req

	if(req.method=='GET'){
		var fileUrl;

		if(req.url=='/') // no specific file name given in Request
			fileUrl='/index.html';
		else
			fileUrl=req.url;

		var filePath=path.resolve('.public/'+fileUrl); // determining the path of the file
		const fileExt=path.extname(filePath);

		if(fileExt=='.html'){
				fs.exists(filePath, (exists)=>{
					if(!exists){
						res.statusCode=404;
						res.setHeader('Content-type','text/html');
						res.end('<html><body><h1>Error 404:--'+fileUrl+' not found</h1></body></html>');
						return;
					}
					res.statusCode=200;
					res.setHeader('Content-type','text/html');
					fs.createReadStream(filePath).pipe(res); // file ready to be sent out
				}); //callback
			}

		else { // if file ext is not html
				res.statusCode=404;
				res.setHeader('Content-type','text/html');
				res.end('<html><body><h1>Error 404:'+fileUrl+' not found. NOT AN HTML FILE</h1></body></html>');
				return;

			}
 	}// GET if block ends here

	else {
		res.statusCode=404;
		res.setHeader('Content-type','text/html');
		res.end('<html><body><h1>Error 404:'+req.method+' not supported by this server</h1></body></html>');
		return;
	}


	/*
	res.statusCode=200; // OK

	res.setHeader('Content-type','text/html');	// setting header for res that content type in response body is text/html
	res.end('<html><body><h1>Hello World</h2></body></html>')  // response
	*/
});
// server is set up now
// time to start the server
server.listen(port,hostname, () => {
	console.log(`Server running at http://${hostname}:${port}`);
});
//now server up and running
