import csv
import random

with open('bars.csv', 'r', newline='') as f:
	csv_reader = csv.reader(f, delimiter=',')
	barNames = []
	next(csv_reader)

	for row in csv_reader:
		barNames.append(row[1])
	#for x in barNames:
	#	print(x)

with open('beers.csv', 'r', newline='') as f:
	csv_reader = csv.reader(f, delimiter=',')
	beerNames = []
	next(csv_reader)

	for row in csv_reader:
		beerNames.append(row[0])
	#for x in beerNames:
	#	print(x)



with open('sells.csv', 'w', newline='') as f:
	csv_writer = csv.writer(f)
	csv_writer.writerow(["barID", "Name", "Beer", "Price"])
	x=0
	beerPrices = []
	while x < len(barNames):
		z=0
		while z<10:
			beerPrices.append(random.randrange(3, 10))
			if random.randrange(0,2) == 1:
				beerPrices[z] += 0.5
			z += 1

		beerPrices.sort()
		rand = random.randrange(0,30)
		i=0
		while i<10:
			csv_writer.writerow([x, barNames[x], beerNames[rand+i], beerPrices[i]])
			i+=1

		x+=1

		
