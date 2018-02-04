var replace = require("replace");
var path = 'src/environments/environment.prod.ts';
var apiUrl = process.env.API_URL;

replace({
  regex: '.*apiUrl.*',
  replacement: '\tapiUrl: \'' + apiUrl + '\'',
  paths: [path]
});
