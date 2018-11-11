import csv
import random

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
	barNames = []
	barStates = []
	next(csv_reader)

	for row in csv_reader:
		barNames.append(row[1])
		barStates.append(row[2])

with open('frequents.csv', 'w', newline='') as f:
	csv_writer = csv.writer(f)
	csv_writer.writerow(["drinkerID", "drinkerName", "barID", "barName", "state"])

	i=0
	while i<len(drinkerNames):
		rand = random.randrange(1,4)
		j=0
		while j < rand: 
			tester = random.randrange(0,len(barStates))
			if drinkerStates[i] == barStates[tester]:
				csv_writer.writerow([i, drinkerNames[i], tester, barNames[tester], drinkerStates[i]])
				j+=1
			else:
				continue
		i+=1

