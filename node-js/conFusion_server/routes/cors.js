const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['https://localhost:3000', 'https://localhost:3443'];
// contains all the origins that the server is willing to accept

var corsOptionsDelegate = (req, callback)=>{
  
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin'))!==-1){
    //if incoming header contains an 'origin' field
        corsOptions = { origin: true };
         // means incoming origin is in the whitelist
         // client side will be informed that it is ok for the server tos
         // accept this request for this specific origin

    }

    else{
        corsOptions = { origin: false };
        
    }
    callback(null, corsOptions);

};

exports.cors = cors();
exports.corsWithOption = cors(corsOptionsDelegate);
