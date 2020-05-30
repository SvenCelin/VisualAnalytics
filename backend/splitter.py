import bigjson
import json

tweet_parts = 10_000
file_count = 5

with open('location_merged_unduplicated_sentiment.json', 'rb') as f:
    tweets = bigjson.load(f)
    part = []
    file_index = 1
    for index, tweet in enumerate(tweets, start=1):
        inner_tweet = {
            'user_id': tweet['user_id'],
            'user_name': tweet['name'],
            'text': tweet['tweet'],
            'tweet_id': tweet['tweet_id'],
            'favorites': tweet['favorites'],
            'retweets': tweet['retweets'],
            'created': tweet['created'],
            'verified': tweet['is_user_verified']
        }
        part.append(inner_tweet)
        if (index % tweet_parts) == 0:
            with open('data-%d.json' % file_index, 'w') as outfile:
                json.dump(part, outfile)
                file_index += 1
                part = []
        if (index % tweet_parts) == 0:
            print(index)
        if (file_index - 1) == file_count:
            break

    with open('data-rest.json', 'w') as outfile:
        json.dump(part, outfile)
        part = []


