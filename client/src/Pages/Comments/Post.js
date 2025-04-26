import React, { useState } from 'react';
import Comments from './Comments'; // Import the existing Comments component
import './Post.css';

const Post = () => {
  // Dummy post data
  const [post, setPost] = useState({
    id: 1,
    title: "Introduction to React Hooks",
    author: "Jane Developer",
    authorId: 101,
    date: "2025-04-20T09:30:00",
    content: `
      React Hooks were introduced in React 16.8 as a way to use state and other React features
      without writing a class component. They allow you to "hook into" React state and lifecycle
      features from function components.
      
      The most commonly used hooks are:
      - useState: For managing state in function components
      - useEffect: For handling side effects like data fetching, subscriptions, etc.
      - useContext: For consuming context in a function component
      - useReducer: For managing more complex state logic
      
      Hooks make it easier to reuse stateful logic between components and organize code based on
      related pieces rather than lifecycle methods.
    `,
    imageUrl: "https://placeholder.com/react-hooks-diagram",
    tags: ["React", "JavaScript", "Web Development", "Hooks"],
    likes: 42,
    views: 320
  });

  // Current user ID (normally would come from authentication)
  const currentUserId = 102;

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle like button click
  const handleLike = () => {
    setPost({
      ...post,
      likes: post.likes + 1
    });
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="post-author">By: {post.author}</span>
          <span className="post-date">Published: {formatDate(post.date)}</span>
          <span className="post-views">{post.views} views</span>
        </div>
        <div className="post-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="post-tag">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="post-content">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() ? <p key={index}>{paragraph}</p> : null
        ))}
      </div>
      
      <div className="post-actions">
        <button className="like-button" onClick={handleLike}>
          Like ({post.likes})
        </button>
        <button className="share-button">
          Share
        </button>
      </div>
      
      {/* Comments section - using learningPlanId as postId */}
      <Comments learningPlanId={post.id} userId={currentUserId} />
    </div>
  );
};

export default Post;