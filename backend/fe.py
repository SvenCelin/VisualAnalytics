from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request
import json
import time


app = Flask(__name__)
DB_URL = 'postgresql://{user}:{pw}@{url}:{port}/{db}'.format(user='va', pw='va', url='localhost', db='va', port='5435')


app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Tweet(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    user_name = db.Column(db.String(128), unique=False, nullable=True)
    user_id = db.Column(db.BigInteger(), unique=False, nullable=False)
    text = db.Column(db.String(2000), unique=False, nullable=False)
    favorites = db.Column(db.Integer(), unique=False, nullable=False)
    retweets = db.Column(db.Integer(), unique=False, nullable=False)
    created = db.Column(db.Date, unique=False, nullable=False)
    verified = db.Column(db.Boolean, unique=False, nullable=False)
    words = db.relationship('WordsInTweet')

    def __str__(self):
        inner_tweet = {
            'user_id': self.user_id,
            'user_name': self.user_name,
            'text': self.text,
            'tweet_id': self.id,
            'favorites': self.favorites,
            'retweets': self.retweets,
            'created': time.mktime(self.created.timetuple()),
            'verified': self.verified
        }
        return json.dumps(inner_tweet)


class Word(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    word = db.Column(db.String(500))


class WordsInTweet(db.Model):
    __tablename__ = 'words_in_tweet'
    id = db.Column(db.Integer, primary_key=True)
    tweet_id = db.Column(db.BigInteger, db.ForeignKey(Tweet.id))
    tweet = db.relationship(Tweet)
    word_id = db.Column(db.Integer, db.ForeignKey(Word.id))
    word = db.relationship(Word)
    count = db.Column(db.Integer())



db.create_all()


@app.route('/search')
def hello_world():
    user_name = request.args.get('user_name')
    found_tweets = Tweet.query.all()
    found_tweets = found_tweets[0:min(len(found_tweets), 10)]
    strings = []
    for tweet in found_tweets:
        strings.append(str(tweet))
    result = ','.join(strings)
    return '[' + result + ']'



if __name__ == '__main__':
    app.run()
