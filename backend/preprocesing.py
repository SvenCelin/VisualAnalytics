import nltk
import re
import json

# get stop words from nltk
from nltk.corpus import stopwords
nltk.download("stopwords")
stopWords = stopwords.words('english')

# pre processing data
def cleanData(sentence):
    # convert to lowercase, ignore all special characters - keep only letters and spaces
    sentence = re.sub(r'[^A-Za-z0-9\s.]',r'',str(sentence).lower())
    sentence = re.sub(r'\n', r' ', sentence)

    # remove stop words
    sentence = " ".join([word for word in sentence.split() if word not in stopWords])

    return sentence

#import data
input_files = [
    "data-ordered-1.json",
    "data-ordered-2.json",
    "data-ordered-3.json",
    "data-ordered-4.json",
    "data-ordered-5.json",
    "data-ordered-6.json",
    "data-ordered-7.json",
    "data-ordered-8.json",
    "data-ordered-9.json",
    "data-ordered-10.json",
    "data-ordered-11.json",
    "data-ordered-12.json"
]
file_index = 1
for input_file in input_files:
    with open(input_file) as json_file:
        data = json.load(json_file)
        for tweet in data:
            tweet['original_text'] = tweet['text']
            tweet['text'] = cleanData(tweet['text'])
        with open('data-without-stopp-words-%d.json' % file_index, 'w') as outfile:
            outfile.write(json.dumps(data))
    file_index += 1
