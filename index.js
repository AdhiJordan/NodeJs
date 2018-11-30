"use strict"
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
const cors = require('cors');
var fm = require('front-matter');
var marked = require('marked');
var router = express.Router();
var http = require('http');

app.use(cors());

let blogFolderPath = [], blog = null;
let blogList = [];

traverseDir('static/js/blogs');

function traverseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    blogFolderPath = path.join(dir, file);
    if (fs.lstatSync(blogFolderPath).isDirectory()) {
      traverseDir(blogFolderPath);
      readFile(blogFolderPath)
    } else {
      readFile(blogFolderPath)
    }
  });
}

function readFile() {
  var md = require("markdown").markdown;
  fs.readFile(blogFolderPath, { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
      blog = fm(data);
      let showData = (JSON.stringify(blog) + ',');
      setApi(showData);
    } else {
      console.log(err);
    }
  });
}

function setApi(data) {
  let dataTest = data.substring(0, data.length - 1);
  blogList.push(JSON.parse(dataTest));

  app.get('/api/blogs', function (req, res) {
    res.send(blogList)
  })
}

const path = require('path')

app.use(express.static(path.join(__dirname, 'ClientApp/build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/ClientApp/build/index.html'))
})


var port = process.env.PORT || 1121;

// if (process.env.NODE_ENV === 'production') {
//   // Serve any static files
//   app.use(express.static(path.join(__dirname, 'ClientApp/build/static/js')));
//   // Handle React routing, return all requests to React app
//   app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'ClientApp/build/static/js/', '*.js'));
//   });
// }


app.listen(port);
