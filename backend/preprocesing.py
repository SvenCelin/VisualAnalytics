import nltk
import random
import pandas as pd
import numpy as np
import re

# get stop words from nltk
from nltk.corpus import stopwords
nltk.download("stopwords")
stopWords = stopwords.words('english')

#import data
#or if you respect your ram just do per data-x.json
data = pd.read_json('location_merged_unduplicated_sentiment.json')


# pre processing data
def cleanData(sentence):
    # convert to lowercase, ignore all special characters - keep only letters and spaces
    sentence = re.sub(r'[^A-Za-z0-9\s.]',r'',str(sentence).lower())
    sentence = re.sub(r'\n', r' ', sentence)

    # remove stop words
    sentence = " ".join([word for word in sentence.split() if word not in stopWords])

    return sentence

# clean data
data['text'] = data['text'].map(lambda x: cleanData(x))


print(data.text.head())