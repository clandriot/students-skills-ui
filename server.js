const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 80);

//PathLocationStrategy
app.get('/*', (req, res) => {
  res.sendile(path.join(__dirname + '/dist/index.html'));
})

console.log('Running!')
