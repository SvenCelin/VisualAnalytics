from fe import app, db, Tweet, Word, WordsInTweet
import json
import datetime


def load_data():
    input_files =   [
                    "data-1.json",
                    "data-2.json",
                    "data-3.json",
                    "data-4.json",
                    "data-5.json"
                    ]
    for input_file in input_files:
        with open(input_file) as json_file:
            data = json.load(json_file)
            existing_words = Word.query.all()
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
                words = tweet['text'].lower()\
                        .replace(',', '')\
                        .replace('.', '')\
                        .replace('!', '')\
                        .replace('(', '')\
                        .replace(')', '')\
                        .replace('_', '')\
                        .replace('-', '')\
                        .replace('?', '')\
                        .replace('\n', '')\
                        .replace('"', '')\
                        .replace('‘', '')\
                        .replace('\'', '').split(' ')
                for word in words:
                    if word.startswith('@') or 'http' in word:
                        continue
                    existing = next((x for x in existing_words if x.word == word), None)
                    if existing is not None:
                        existing_word_in_tweet = next((x for x in tw.words if x.word == word), None)
                        if existing_word_in_tweet is not None:
                            # todo might not work
                            existing_word_in_tweet.count += 1
                        else:
                            another_one = WordsInTweet(tweet=tw, word=existing, count=1)
                            tw.words.append(another_one)
                    else:
                        new_word = Word(word=word)
                        another_one = WordsInTweet(tweet=tw, word=new_word, count=1)
                        tw.words.append(another_one)
                        created_words.append(new_word)
                        existing_words.append(new_word)
                tweets.append(tw)
                print(index)
            db.session.add_all(tweets)
            db.session.add_all(created_words)
            db.session.commit()


load_data()



