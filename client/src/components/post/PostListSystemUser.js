import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/PostList.css';
import Comments from '../comment/Comments'; // Import the Comments component

export default function PostsListS() {
    const [posts, setPosts] = useState([]);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(1); // This should come from your auth context
    const [commentCounts, setCommentCounts] = useState({});
    
    useEffect(() => {
        loadPosts();
        // Here you would also fetch the current user's ID from your auth system
    }, []);
    
    const loadPosts = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/posts');
            setPosts(result.data);
            
            // Fetch comment counts for each post
            const counts = {};
            for (const post of result.data) {
                const commentsResult = await axios.get(`http://localhost:8080/api/posts/${post.id}/comments`);
                counts[post.id] = commentsResult.data.length;
            }
            setCommentCounts(counts);
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    };
    
    const deletePost = async (id) => {
        await axios.delete(`http://localhost:8080/api/posts/${id}`);
        loadPosts();
    };

    // Toggle comments visibility for a post
    const toggleComments = (postId) => {
        if (activeCommentPostId === postId) {
            setActiveCommentPostId(null); // Close comments if already open
        } else {
            setActiveCommentPostId(postId); // Open comments for this post
        }
    };

    // Get initial letter for avatar placeholder
    const getInitial = (title) => {
        return title ? title.charAt(0).toUpperCase() : "P";
    };

    // Format timestamp (placeholder function - replace with actual date formatting)
    const formatDate = (timestamp) => {
        if (!timestamp) return "Just now";
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };

    // Handle like/unlike post
    const handleLikePost = async (postId) => {
        try {
            // Check if user already liked the post
            const post = posts.find(p => p.id === postId);
            if (post && post.likes && post.likes.includes(currentUserId)) {
                // Unlike
                await axios.put(`http://localhost:8080/api/posts/${postId}/unlike/${currentUserId}`);
            } else {
                // Like
                await axios.put(`http://localhost:8080/api/posts/${postId}/like/${currentUserId}`);
            }
            loadPosts();
        } catch (error) {
            console.error("Error handling post like:", error);
        }
    };

    // Check if the current user has liked a post
    const hasUserLikedPost = (post) => {
        return post.likes && post.likes.includes(currentUserId);
    };

    return (
        <div className="postlist-container">
            <div className="posts-wrapper">
                <div className="postlist-header">
                    <h2 className="postlist-title">Find Skills</h2>
                    <Link to="/add-post" className="postlist-add-btn">Create Post</Link>
                </div>
                
                <div className="create-post">
                    <div className="create-post-header">
                        <div className="post-avatar">
                            <span>U</span>
                        </div>
                        <Link to="/add-post" className="create-input">
                            Share your skills...
                        </Link>
                    </div>
                </div>
            
                {posts.length === 0 ? (
                    <div className="postlist-empty">
                        <div className="postlist-empty-icon">
                            <i className="bi bi-journal-text"></i>
                        </div>
                        <p>No posts available. Create your first post!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="post-avatar">
                                    <span>{getInitial(post.title)}</span>
                                </div>
                                <div className="post-author">
                                    <p className="post-author-name">User {post.userId}</p>
                                    <p className="post-timestamp">{formatDate(post.createdAt)}</p>
                                </div>
                            </div>
                            
                            <div className="post-content">
                                <h3 className="post-title">{post.title}</h3>
                                <p>{post.content.length > 250 
                                    ? post.content.substring(0, 250) + '...' 
                                    : post.content}
                                </p>
                                
                                {/* Display media if available */}
                                {post.mediaUrls && post.mediaUrls.length > 0 && (
                                    <div className="post-media">
                                        {post.mediaUrls.map((url, index) => (
                                            <img 
                                                key={index} 
                                                src={url} 
                                                alt={`Post media ${index + 1}`} 
                                                className="post-media-item" 
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="post-engagement">
                                <div className={`post-likes ${hasUserLikedPost(post) ? 'you-liked' : ''}`}>
                                    <span className="likes-icon">
                                        <i className={`bi ${hasUserLikedPost(post) ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>
                                    </span>
                                    <span>
                                        {post.likes?.length || 0} 
                                        {hasUserLikedPost(post) && post.likes?.length > 0 && (
                                            <span className="liked-indicator"> • You liked this</span>
                                        )}
                                    </span>
                                </div>
                                <div className="post-comments-count" onClick={() => toggleComments(post.id)}>
                                    {commentCounts[post.id] || 0} Comments
                                </div>
                            </div>
                            
                            {/* <div className="post-actions">
                                <button 
                                    className={`post-action-btn ${hasUserLikedPost(post) ? 'liked' : ''}`}
                                    onClick={() => handleLikePost(post.id)}
                                >
                                    <i className={`bi ${hasUserLikedPost(post) ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i> 
                                    {hasUserLikedPost(post) ? 'Liked' : 'Like'}
                                </button>
                                <button className="post-action-btn" onClick={() => toggleComments(post.id)}>
                                    <i className="bi bi-chat"></i> Comment
                                </button>
                                <button className="post-action-btn">
                                    <i className="bi bi-share"></i> Share
                                </button>
                            </div> */}
                            
                            {/* Comments section */}
                            {activeCommentPostId === post.id && (
                                <div className="post-comments-section">
                                    <Comments 
                                        postId={post.id} 
                                        userId={currentUserId} 
                                        showLikedIndicator={true} 
                                    />
                                </div>
                            )}
                            
                            {/* Action buttons */}
                            <div className="post-buttons">
                                <Link to={`/view-post/${post.id}`} className="post-btn post-btn-view">
                                    <i className="bi bi-eye"></i> View
                                </Link>
                                {post.userId === currentUserId && (
                                    <>
                                        <Link to={`/edit-post/${post.id}`} className="post-btn post-btn-edit">
                                            <i className="bi bi-pencil"></i> Edit
                                        </Link>
                                        <button className="post-btn post-btn-delete" onClick={() => deletePost(post.id)}>
                                            <i className="bi bi-trash"></i> Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}