const http = require('http');
const express = require('express');
const mysql = require('mysql');

const app = express();
const clientPath = `${__dirname}/../client`
console.log(`Serving static from ${clientPath}`);
app.use(express.static(clientPath));

app.get('/', function(req,res) {
	res.send('this is the homepage');
	/*db.connect();
	db.query('SELECT * FROM BBDPlus.bars', (err, rows) => {
		if(err) throw err;
		console.log(rows);
		//res.end(rows)
	});*/
});

app.listen('3000', () => {
	console.log('Server started on port 3000');
});