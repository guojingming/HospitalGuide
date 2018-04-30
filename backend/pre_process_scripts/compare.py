import sys
import json
import synonyms

#This python script is used to check if there are two similar symptoms in original data.

symptomFile = open('./symptoms.json')
symptomStr = symptomFile.read()
symptomFile.close()
symptoms = json.loads(symptomStr)

count = 0
for symptom1 in symptoms:
    for symptom2 in symptoms:
        if symptom1==symptom2:
            continue
        result = synonyms.compare(symptom1, symptom2, seg=True)
        if result >= 0.9:
            count = count + 1
            print symptom1 + " and " + symptom2 + " : " + result
print "-------------------------"
print "Similar symptoms count:" + count
print "-------------------------"