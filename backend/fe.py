from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request
import json
import time
from datetime import datetime
from sqlalchemy import text, cast, Date as sqlDate
from sqlalchemy import func



app = Flask(__name__, static_url_path='', static_folder='../',)
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
    form_to_be_used = db.Column(db.String(500))
    original_words = db.relationship('OriginalWord')


class OriginalWord(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    original = db.Column(db.String(500))
    word_id = db.Column(db.BigInteger, db.ForeignKey(Word.id))
    word = db.relationship(Word)


class WordsInTweet(db.Model):
    __tablename__ = 'words_in_tweet'
    id = db.Column(db.Integer, primary_key=True)
    tweet_id = db.Column(db.BigInteger, db.ForeignKey(Tweet.id))
    tweet = db.relationship(Tweet)
    word_id = db.Column(db.Integer, db.ForeignKey(Word.id))
    word = db.relationship(Word)
    count = db.Column(db.Integer())



db.create_all()


def to_bool(v):
    return v.lower() in ("true", "1")


@app.route('/searchWords')
def search_words():
    user_name = request.args.get('user_name')
    verified = request.args.get('verified')
    start_date = request.args.get('from')
    end_date = request.args.get('to')
    count = request.args.get('maxCount')
    found_words = filter_tweets(user_name, verified, start_date, end_date).group_by(Word.form_to_be_used, Word.id)\
        .order_by(text('occurrences DESC'))\
        .limit(count or 25)\
        .all()
    word_ids = []
    for word in found_words:
        word_ids.append(word[1])
    with_stems = get_words_with_stems(word_ids)
    words = []
    for word in found_words:
        stems = next((x for x in with_stems if x.id == word.id), None)
        original_words = [word.original for word in stems.original_words]
        formatted_word = {'word': word[0], 'amount': word[2], 'original': original_words}
        words.append(formatted_word)
    return json.dumps(words)


@app.route('/userNames')
def retrieve_user_names():
    user_names = db.session.query(Tweet.user_name).group_by(Tweet.user_name).all()
    result_array = []
    for user_name in user_names:
        result_array.append(user_name[0])
    return json.dumps(result_array)

@app.route('/meta')
def meta_info():
    tweet_count = db.session.execute(Tweet.query.statement.with_only_columns([func.count()]).order_by(None)).scalar()
    user_count = len(db.session.query(Tweet.user_id, func.count(Tweet.user_id)).group_by(Tweet.user_id).all())
    word_count = db.session.execute(Word.query.statement.with_only_columns([func.count()]).order_by(None)).scalar()
    dates = db.session.execute(Tweet.query.statement.with_only_columns([cast(func.max(Tweet.created), sqlDate), cast(func.min(Tweet.created), sqlDate)]))
    min_date = ''
    max_date = ''
    for row in dates:
        min_date = time.mktime(row[1].timetuple())
        max_date = time.mktime(row[0].timetuple())
    return json.dumps({'tweets': tweet_count, 'words': word_count, 'userCount': user_count, 'minDate': min_date, 'maxDate': max_date})


def filter_tweets(user_name, verified, start_date, end_date):
    query = Tweet.query\
        .join(WordsInTweet)\
        .join(Word)\
        .with_entities(Word.form_to_be_used, Word.id, func.count(Word.word).label('occurrences'))

    if user_name:
        query = query.filter(Tweet.user_name == user_name)
    if verified:
        verified_boolean = to_bool(verified)
        query = query.filter(Tweet.verified == verified_boolean)
    if start_date:
        time_stamp = datetime.fromtimestamp(int(start_date))
        query = query.filter(Tweet.created > time_stamp)
    if end_date:
        time_stamp = datetime.fromtimestamp(int(end_date))
        query = query.filter(Tweet.created < time_stamp)
    return query


def get_words_with_stems(word_ids):
    query = Word.query.join(OriginalWord).filter(Word.id.in_(word_ids)).all()
    return query


if __name__ == '__main__':
    app.run()
