"use client";
import "./styles.css"; 
// import CategoryBar from "@/components/CategoryBar/CategoryBar";
import axios from "axios";
import { useState, useEffect } from "react";
import Feed from "@/components/feed/Feed";

const fetchPosts = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_NEXT_URL}/api/post/fetch`);
    return data.posts;
  } catch (error) {
    console.log(error);
  }
};

export default function Home() {
  const [data, setData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [fallAnimation, setFallAnimation] = useState(false);

  const getInitialPosts = async () => {
    const posts = await fetchPosts();
    setData(posts);
  };

  const fetchRecommendations = async () => {
    try {
      const samplePostId = data[0]._id; // Ensure this is set correctly
      const response = await axios.get(`http://127.0.0.1:5000/recommend?post_id=${samplePostId}`); //replace with the url generated after running app.py
      setRecommendations(response.data);
    } catch (error) {
      console.log("Error fetching recommendations:", error);
    }
  };

  const toggleRecommendations = async () => {
    if (!showRecommendations) {
      await fetchRecommendations();
      setFallAnimation(true); // Start fall animation
    } else {
      setFallAnimation(false); // Prepare for hiding animation
    }
    setShowRecommendations(!showRecommendations);
  };

  useEffect(() => {
    getInitialPosts();
  }, []);

  return (
    <main className="p-5 xl:w-[65%]">
      <link rel="icon" href="favicon.ico" sizes="any" />
     

      <button
        onClick={toggleRecommendations}
        className="bg-blue-500 text-white p-2 rounded mt-5 hover:bg-blue-700 transition-colors"
      >
        {showRecommendations ? "Hide Recommendations" : "Get Recommendations"}
      </button>

      {showRecommendations && (
        <div
          className={`mt-10 p-4 border border-blue-300 rounded shadow-lg transition-all duration-500 ease-in-out ${fallAnimation ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-5 opacity-0'}`}
        >
          <h2 className="text-xl font-bold mb-4">Recommended Articles</h2>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index} className="mb-4 p-2 border-b last:border-b-0">
                <h3 className="text-lg font-semibold">{rec.title}</h3>
                <p className="text-gray-500">{rec.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Feed data={data} />
    </main>
  );
}
