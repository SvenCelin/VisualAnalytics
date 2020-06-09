from fe import app, db, Tweet, Word, WordsInTweet
import json
import datetime

import re

regex = re.compile(r"[^a-zA-Z ]", re.IGNORECASE)

def load_data():
    input_files =   [
                    "data-without-stopp-words-1.json",
                    "data-without-stopp-words-2.json",
                    "data-without-stopp-words-3.json",
                    "data-without-stopp-words-4.json",
                    "data-without-stopp-words-5.json",
                    "data-without-stopp-words-6.json",
                    "data-without-stopp-words-7.json",
                    "data-without-stopp-words-8.json",
                    "data-without-stopp-words-9.json",
                    "data-without-stopp-words-10.json",
                    "data-without-stopp-words-11.json",
                    "data-without-stopp-words-12.json"
                    ]
    for input_file in input_files:
        with open(input_file) as json_file:
            print(input_file)
            print(datetime.datetime.now())
            data = json.load(json_file)
            existing_words = {}
            for old_word in Word.query.all():
                existing_words[old_word.word] = old_word
            tweets = []
            created_words = []
            for index, tweet in enumerate(data):
                tweet_id = tweet['tweet_id']
                tw = Tweet(id=tweet_id,
                           user_name=tweet['user_name'],
                           user_id=tweet['user_id'],
                           text=tweet['text'],
                           favorites=tweet['favorites'],
                           retweets=tweet['retweets'],
                           created=datetime.datetime.strptime(tweet['created'], '%d-%b-%Y'),
                           verified=tweet['verified']
                           )
                lower_tweet_text = tweet['text'].lower()

                words = regex.sub('', lower_tweet_text).split(' ')
                for word in words:
                    if word.startswith('@') or 'http' in word:
                        continue
                    if word in existing_words:
                        existing_word_in_tweet = next((x for x in tw.words if x.word.word == word), None)
                        if existing_word_in_tweet is not None:
                            existing_word_in_tweet.count += 1
                        else:
                            another_one = WordsInTweet(tweet=tw, word=existing_words[word], count=1)
                            tw.words.append(another_one)
                    else:
                        new_word = Word(word=word)
                        another_one = WordsInTweet(tweet=tw, word=new_word, count=1)
                        tw.words.append(another_one)
                        created_words.append(new_word)
                        existing_words[word] = new_word
                tweets.append(tw)
                #print(index)
            db.session.add_all(tweets)
            db.session.add_all(created_words)
            db.session.commit()


load_data()



