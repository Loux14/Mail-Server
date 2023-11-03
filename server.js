var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');


app.use(express.static("public"));
app.use(bodyParser.json());
console.log(JSON.parse(fs.readFileSync('letters.json')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/courriel.html');
});

app.get('/getLetters', (req, res) => {
  res.sendFile(__dirname + '/letters.json');
});

app.get('/getContacts', function (req, res) {
  res.sendFile(__dirname + '/contacts.json');
});

app.post('/addContact', (req, res) => {
  const { email, publicKey } = req.body;
  const contacts = JSON.parse(fs.readFileSync('contacts.json'));
  contacts.push({ email, publicKey });
  fs.writeFileSync('contacts.json', JSON.stringify(contacts));
  res.sendStatus(200);
});

app.post('/addLetter', (req, res) => {
  const { from, encryptedLetter } = req.body;
  const letters = JSON.parse(fs.readFileSync('letters.json'));
  letters.push({ from, encryptedLetter });
  fs.writeFileSync('letters.json', JSON.stringify(letters));
  res.sendStatus(200);
});




app.listen(8080);

