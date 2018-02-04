var replace = require('replace-in-file');
var apiUrl = process.env.API_URL;
const prod = {
  files: 'src/environments/environment.prod.ts',
  from: /{API_URL}/g,
  to: apiUrl,
  allowEmptyPaths: false,
};
try {
  let changedFiles = replace.sync(prod);
  console.log('API Url set: ' + apiUrl);
}
catch (error) {
  console.error('Error occurred:', error);
}
