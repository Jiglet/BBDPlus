import csv
import random
from datetime import timedelta
from datetime import datetime

with open('drinkers.csv', 'r', newline='') as f:
	csv_reader = csv.reader(f, delimiter=',')
	drinkerNames = []
	drinkerStates = []
	next(csv_reader)

	for row in csv_reader:
		drinkerNames.append(row[1]+" "+row[2])
		drinkerStates.append(row[4])


with open('bars.csv', 'r', newline='') as f:
	csv_reader = csv.reader(f, delimiter=',')
	barOpeningTimes = []
	barClosingTimes = []
	barStates = []
	barNames1 = []
	next(csv_reader)

	for row in csv_reader:
		barNames1.append(row[1])
		barStates.append(row[2])
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

def random_date(start, end):
    """
    This function will return a random datetime between two datetime 
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    return start + timedelta(seconds=random_second)

with open('transactions.csv', 'w', newline='') as f:
	csv_writer = csv.writer(f)
	csv_writer.writerow(["transactionID", "drinkerID", "drinkerName", "barID", "barName", "time", "date", "beer ordered", "price"])

	x=0
	while x<20000:
		randDrinker = random.randrange(0,1000)
		randBar = random.randrange(0,1000)
		randBeer = random.randrange(0,len(beerPrices))
		if(barStates[randBar] == drinkerStates[randDrinker] and barNames[randBeer] == barNames1[randBar]):
			csv_writer.writerow([x, randDrinker, drinkerNames[randDrinker], barID[randBeer], barNames[randBeer], 
				random.randrange(int(barOpeningTimes[int(barID[randBeer])]), 25), 
				random_date(datetime.strptime('1/1/2014', '%m/%d/%Y').date(),datetime.strptime('1/1/2018', '%m/%d/%Y').date()), 
				beerNames[randBeer], beerPrices[randBeer]])
			x+=1
