import pymongo
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from bson import ObjectId
from pymongo.errors import PyMongoError
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['test1']  # Replace with your database name
collection = db['posts']  # Replace with your collection name

# Function to fetch posts and calculate cosine similarity
def fetch_posts_and_calculate_similarity():
    # Fetch posts data from MongoDB
    cursor = collection.find({}, {'_id': 1, 'title': 1, 'content': 1})
    df = pd.DataFrame(list(cursor))

    if df.empty:
        print("No posts found in the database.")
        return None, None  # Return None if no posts are found

    # Create a TF-IDF Vectorizer
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(df['content'])
    print("TF-IDF matrix created successfully.")

    # Compute cosine similarity matrix
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    return df, cosine_sim

# Get recommendations
def get_recommendations(post_id, df, cosine_sim):
    try:
        post_id = ObjectId(post_id)  # Convert to ObjectId
    except Exception as e:
        print(f"Error converting post_id to ObjectId: {e}")
        return None

    # Check if post_id exists in the DataFrame
    if post_id not in df['_id'].values:
        print(f"No matching post found for ID {post_id}")
        return None

    # Get the index of the post that matches the given post_id
    idx = df[df['_id'] == post_id].index[0]

    # Get the pairwise similarity scores of all posts with that post
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the posts based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 5 most similar posts
    sim_scores = sim_scores[1:6]  # Skip the first one since it's the post itself

    # Get the post indices
    post_indices = [i[0] for i in sim_scores]

    # Return the top 5 most similar posts
    return df.iloc[post_indices][['title', 'content']]

# Flask route to get recommendations
@app.route('/recommend', methods=['GET'])
def recommend():
    post_id = request.args.get('post_id')

    if not post_id:
        return jsonify({"error": "post_id parameter is required"}), 400

    df, cosine_sim = fetch_posts_and_calculate_similarity()
    if df is None:
        return jsonify({"error": "No posts available for recommendations."}), 404

    # Get recommendations for the given post_id
    recommendations = get_recommendations(post_id, df, cosine_sim)

    if recommendations is None:
        return jsonify({"error": f"No post found with ID {post_id}"}), 404

    # Convert the DataFrame to a dictionary and return as JSON
    return jsonify(recommendations.to_dict(orient='records'))

if __name__ == "__main__":
    app.run(debug=True)
