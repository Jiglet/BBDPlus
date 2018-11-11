import csv
import random

with open('drinkers.csv', 'r', newline='') as f:
	csv_reader = csv.reader(f, delimiter=',')
	drinkerNames = []
	next(csv_reader)

	for row in csv_reader:
		drinkerNames.append(row[1]+" "+row[2])


with open('bars.csv', 'r', newline='') as f:
	csv_reader = csv.reader(f, delimiter=',')
	barOpeningTimes = []
	barClosingTimes = []
	next(csv_reader)

	for row in csv_reader:
		barOpeningTimes.append(row[3])
		barClosingTimes.append(row[4])

with open('sells.csv', 'r', newline='') as f:
	csv_reader = csv.reader(f, delimiter=',')
	barID = []
	barNames = []
	beerNames = []
	beerPrices = []
	next(csv_reader)

	for row in csv_reader:
		barID.append(row[0])
		barNames.append(row[1])
		beerNames.append(row[2])
		beerPrices.append(row[3])		

with open('transactions.csv', 'w', newline='') as f:
	csv_writer = csv.writer(f)
	csv_writer.writerow(["transactionID", "drinkerID", "drinkerName", "barID", "barName", "time", "beer ordered", "price"])

	x=0
	while x<20000:
		randDrinker = random.randrange(0,len(drinkerNames))
		randBar = random.randrange(0,len(barNames))
		randBeer = random.randrange(0,len(beerPrices))

		csv_writer.writerow([x, randDrinker, drinkerNames[randDrinker], barID[randBeer], barNames[randBeer], 
			random.randrange(int(barOpeningTimes[int(barID[randBeer])]), 25), beerNames[randBeer], beerPrices[randBeer]])
		x+=1
