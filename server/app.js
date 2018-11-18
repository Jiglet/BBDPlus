const http = require('http');
const express = require('express'); 
const mysql = require('mysql');
const async = require('async')
var bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = http.createServer(app);

//Create connection
const db = mysql.createConnection({
	host: 'bbdplus.c9quegb1lrrw.us-east-2.rds.amazonaws.com',
	port: 3306,
	user: 'jrt160',
	password: 'Toddchen123!',
});

db.connect(function(err) {
	if (err) throw err;
	console.log('connected to database');
});

//Regular Pages
app.get('/bars', function(req,res) {
	db.query('SELECT * FROM BBDPlus.bars', (err, rows) => {
		if(err) throw err;
		else {
			res.render('bars.ejs', {print: rows});
		}
	});
});

app.get('/beers', function(req, res) {
	db.query('SELECT * FROM BBDPlus.beers', (err, rows) => {
		if(err) throw err;
		else {
			res.render('beers.ejs', {print: rows});
		}
	});
});

app.get('/drinkers', function(req, res) {
	db.query('SELECT * FROM BBDPlus.drinkers', (err, rows) => {
		if(err) throw err;
		else {
			res.render('drinkers.ejs', {print: rows});
		}
	});
});

//Details of individuals
app.get('/bars/:barName', function(req, res) {
	var sql1 = "SELECT t1.drinkerName, t1.barName, SUM(t1.price) AS spent FROM BBDPlus.transactions t1 WHERE t1.barName = ? GROUP BY t1.drinkerName ORDER BY SUM(t1.price) DESC LIMIT 5";
	var sql2 = "SELECT t1.beerOrdered, COUNT(t1.beerOrdered) AS amount FROM BBDPlus.transactions t1 WHERE t1.barName = ? GROUP BY t1.beerOrdered ORDER BY COUNT(t1.beerOrdered) DESC LIMIT 5";
	var sql3 = "SELECT b.manufacturer, COUNT(b.manufacturer) AS numSold FROM BBDPlus.transactions t, BBDPlus.beers b WHERE t.barName = ? AND t.beerOrdered = b.beer GROUP BY b.manufacturer ORDER BY COUNT(b.manufacturer) DESC LIMIT 5";
	var sql4 = "SELECT t.time, COUNT(t.time) AS numTrans FROM BBDPlus.transactions t WHERE t.barName = ? GROUP BY t.time ORDER BY t.time";
	var sql5 = "SELECT DAYOFWEEK(t.date) AS day, SUM(t.price) AS dowSum FROM BBDPlus.transactions t WHERE t.barName = 'Windy Wife Tavern' GROUP BY day ORDER BY day";

	db.query(sql1, req.params.barName, (err, rows) => {
		topDrinkers = rows;
		
		db.query(sql2, req.params.barName, (err, rows) => {
			topBeers = rows;

			db.query(sql3, req.params.barName, (err, rows) => {
				topManufacturers = rows;

				db.query(sql4, req.params.barName, (err, rows) => {
					busiestTimeofDay = rows;

					db.query(sql5, req.params.barName, (err, rows) => {
						dowSum = rows;
						res.render('barDetails.ejs', {
							name: req.params.barName, 
							topDrinkersTable: topDrinkers, 
							topBeersTable: topBeers, 
							topManfsTable: topManufacturers,
							busiestTimeTable: busiestTimeofDay,
							dowSum: dowSum
						});
					});
				});
			});
		});
	});
	
});

app.get('/beers/:beerName', function(req, res) {
	var sql1 = "SELECT t1.barName, COUNT(t1.barName) AS numSold FROM BBDPlus.transactions t1 WHERE t1.beerOrdered = ? GROUP BY t1.barName ORDER BY COUNT(t1.barName) DESC LIMIT 5";
	var sql2 = "SELECT t1.drinkerName, COUNT(t1.drinkerName) AS numDrinks FROM BBDPlus.transactions t1 WHERE t1.beerOrdered = ? GROUP BY t1.drinkerName ORDER BY COUNT(t1.drinkerName) DESC LIMIT 5";
	var sql3 = "SELECT t.time, count(t.beerOrdered) AS numTrans FROM BBDPlus.transactions t WHERE t.beerOrdered = ? GROUP BY t.time ORDER BY t.time";
	db.query(sql1, req.params.beerName, (err, rows) => {
		topBars = rows;

		db.query(sql2, req.params.beerName, (err, rows) => {
			topDrinkers = rows;

			db.query(sql3, req.params.beerName, (err, rows) => {
				sellTimes = rows;

				res.render('beerDetails.ejs', {
					name: req.params.beerName,
					topBars: topBars,
					topDrinkers: topDrinkers,
					sellTimes: sellTimes
				});
			});
		});
	});
});

app.get('/drinkers/:drinkerName', function(req, res) {
	var sql1 = "SELECT t.drinkerName, t.barName, t.beerOrdered, t.price, t.time, t.date FROM BBDPlus.transactions t WHERE t.drinkerName = ? GROUP BY t.barName ORDER BY t.time";
	var sql2 = "SELECT t.beerOrdered, COUNT(t.beerOrdered) AS numOrdered FROM BBDPlus.transactions t WHERE t.drinkerName = 'Dustin Resnick' GROUP BY t.beerOrdered ORDER BY numOrdered DESC LIMIT 5";
	var sql3 = "SELECT DAY(t.date) AS day, SUM(t.price) AS total FROM BBDPlus.transactions t WHERE t.drinkerName = ? GROUP BY day ORDER BY day";
	var sql4 = "SELECT MONTH(t.date) AS month, SUM(t.price) AS total FROM BBDPlus.transactions t WHERE t.drinkerName = ? GROUP BY month ORDER BY month"
	var sql5 = "SELECT DAYOFWEEK(t.date) AS day, SUM(t.price) AS total FROM BBDPlus.transactions t WHERE t.drinkerName = ? GROUP BY day ORDER BY day"

	db.query(sql1, req.params.drinkerName, (err, rows) => {
		drinkerTrans = rows;

		db.query(sql2, req.params.drinkerName, (err, rows) => {
		topBeers = rows;

			db.query(sql3, req.params.drinkerName, (err, rows) => {
				daySum = rows;

				db.query(sql4, req.params.drinkerName, (err, rows) => {
					monthSum = rows;

					db.query(sql5, req.params.drinkerName, (err, rows) => {
						dowSum = rows;

						res.render('drinkerDetails.ejs', {
							name: req.params.drinkerName,
							drinkerTrans: drinkerTrans,
							topBeers: topBeers,
							daySum: daySum,
							monthSum: monthSum,
							dowSum: dowSum
						});
					});
				});
			});
		});
	});
});

app.get('/modifications', function(req, res) {
	res.render('modifications.ejs');
});

app.post('/barMod', function(req, res) {
	var inputVal = req.body.command;
	var name = req.body.name;
	var state = req.body.state;
	var openTime = req.body.openTime;
	var closeTime = req.body.closeTime;
	
	var addSQL = "INSERT INTO BBDPlus.bars (name, state, openTime, closeTime) VALUE (?,?,?,?)";
	var delSQL = "DELETE FROM BBDPlus.bars WHERE name = ?";
	var updSQL = "UPDATE BBDPlus.bars SET name=?, state=?, openTime=?, closeTime=? WHERE name = ?"
	
	if (inputVal == 'add') {
		db.query(addSQL, [name,state,openTime,closeTime], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'delete') {
		db.query(delSQL, [name,state,openTime,closeTime], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'update') {
		db.query(updSQL, [name,state,openTime,closeTime,name], (err, rows) => {
			if (err) throw err;
		});	
	}
	res.redirect('bars');
});

app.post('/beerMod', function(req, res) {
	var inputVal = req.body.command;
	var beerName = req.body.beerName;
	var manf = req.body.manf;
	
	var addSQL = "INSERT INTO BBDPlus.beers (beer, manufacturer) VALUE (?,?)";
	var delSQL = "DELETE FROM BBDPlus.beers WHERE beer = ?";
	var updSQL = "UPDATE BBDPlus.beers SET beer=?, manufacturer=? WHERE beer = ?"
	
	if (inputVal == 'add') {
		db.query(addSQL, [beerName,manf], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'delete') {
		db.query(delSQL, [beerName,manf], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'update') {
		db.query(updSQL, [beerName,manf,beerName], (err, rows) => {
			if (err) throw err;
		});	
	}
	res.redirect('beers');
});

app.post('/drinkerMod', function(req, res) {
	var inputVal = req.body.command;
	var id = req.body.id;
	var first = req.body.first;
	var last = req.body.last;
	var age = req.body.age;
	var state = req.body.state;
	
	var addSQL = "INSERT INTO BBDPlus.drinkers (id, first, last, age, state) VALUE (?, ?,?,?,?)";
	var delSQL = "DELETE FROM BBDPlus.drinkers WHERE id=?";
	var updSQL = "UPDATE BBDPlus.drinkers SET first=?, last=?, age=?, state=? WHERE id=?"
	
	if (inputVal == 'add') {
		db.query(addSQL, [id, first, last, age, state], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'delete') {
		db.query(delSQL, [id], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'update') {
		db.query(updSQL, [first, last, age, state, id], (err, rows) => {
			if (err) throw err;
		});	
	}
	res.redirect('drinkers');
});

app.post('/freqMod', function(req, res) {
	var inputVal = req.body.command;
	var drinkerID = req.body.drinkerID;
	var freqID = req.body.freqID;
	var drinkerName = req.body.drinkerName;
	var barName = req.body.barName;
	
	var addSQL = "INSERT INTO BBDPlus.frequents (drinkerID, freqID, drinkerName,barName) VALUE (?,?,?,?)";
	var delSQL = "DELETE FROM BBDPlus.frequents WHERE freqID=?";
	var updSQL = "UPDATE BBDPlus.frequents SET drinkerID=?, freqID=?, drinkerName=?, barName=? WHERE freqID = ?"
	
	if (inputVal == 'add') {
		db.query(addSQL, [drinkerID, freqID, drinkerName, barName], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'delete') {
		db.query(delSQL, [freqID], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'update') {
		db.query(updSQL, [drinkerID, freqID, drinkerName, barName, freqID], (err, rows) => {
			if (err) throw err;
		});	
	}
	res.redirect('modifications');
});

app.post('/sellMod', function(req, res) {
	var inputVal = req.body.command;
	var barName = req.body.barName;
	var beerSold = req.body.beerSold;
	var price = req.body.price;
	
	var addSQL = "INSERT INTO BBDPlus.sells (Name, Beer, Price) VALUE (?,?,?)";
	var delSQL = "DELETE FROM BBDPlus.sells WHERE Name=? AND Beer=?";
	var updSQL = "UPDATE BBDPlus.sells SET Name=?, Beer=?, Price=? WHERE Name = ? AND Beer = ?";
	
	if (inputVal == 'add') {
		db.query(addSQL, [barName, beerSold, price], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'delete') {
		db.query(delSQL, [barName, beerSold], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'update') {
		db.query(updSQL, [barName, beerSold, price, barName, beerSold], (err, rows) => {
			if (err) throw err;
		});	
	}
	res.redirect('modifications');
});

app.post('/transMod', function(req, res) {
	var inputVal = req.body.command;
	var transID = req.body.transID;
	var drinkerName = req.body.drinkerName;
	var barName = req.body.barName;
	var time = req.body.time;
	var date = req.body.date;
	var beerOrdered = req.body.beerOrdered;
	var price = req.body.price;
	
	var addSQL = "INSERT INTO BBDPlus.transactions (transactionID, drinkerName, barName, time, date, beerOrdered, price) VALUE (?,?,?,?,?,?,?)";
	var delSQL = "DELETE FROM BBDPlus.transactions WHERE transactionID=?";
	var updSQL = "UPDATE BBDPlus.transactions SET drinkerName=?, barName=?, time=?, date=?, beerOrdered=?, price=? WHERE transactionID= ?";
	
	if (inputVal == 'add') {
		db.query(addSQL, [transID, drinkerName, barName, time, date, beerOrdered, price], (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'delete') {
		db.query(delSQL, transID, (err, rows) => {
			if (err) throw err;
		});	
	}

	else if (inputVal == 'update') {
		db.query(updSQL, [drinkerName, barName, time, date, beerOrdered, price, transID], (err, rows) => {
			if (err) throw err;
		});	
	}
	res.redirect('modifications');
});

app.listen('3000', () => {
	console.log('Server started on port 3000');
});
