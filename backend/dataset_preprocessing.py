import bigjson
import json
tweet_parts = 10_000
file_count = 5

max_tweet_count = file_count * tweet_parts

chosen_users = []
available_users = {}
known_users = []


input_file = 'location_merged_unduplicated_sentiment.json'
with open(input_file, 'rb') as f:
    tweets = bigjson.load(f)
    for index, tweet in enumerate(tweets, start=1):
        user_id = tweet['user_id']
        print(index)
        if user_id in available_users:
            available_users[user_id]['count'] += 1
        else:
            available_users[user_id] = {'count': 1}
            known_users.append(user_id)
    known_users.sort(key=lambda x: available_users[x]['count'], reverse=True)
    print(known_users)
    current_tweet_count = 0
    user_count = 0
    for user in known_users:
        user_count += 1
        current_tweet_count += available_users[user]['count']
        if current_tweet_count > max_tweet_count:
            break
    chosen_users = known_users[0:user_count]
    chosen_users_dict = {}
    for user in chosen_users:
        chosen_users_dict[user] = 1


with open(input_file, 'rb') as f:
    tweets = bigjson.load(f)
    part = []
    file_index = 1
    for index, tweet in enumerate(tweets, start=1):
        user_id = tweet['user_id']
        if user_id in chosen_users_dict:
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
                with open('data-ordered-%d.json' % file_index, 'w') as outfile:
                    json.dump(part, outfile)
                    file_index += 1
                    part = []
        print(index)
