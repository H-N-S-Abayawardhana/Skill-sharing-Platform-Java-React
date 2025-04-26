import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/PostList.css';

export default function PostsList() {
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        loadPosts();
    }, []);
    
    const loadPosts = async () => {
        const result = await axios.get('http://localhost:8080/api/posts');
        setPosts(result.data);
    };
    
    const deletePost = async (id) => {
        await axios.delete(`http://localhost:8080/api/posts/${id}`);
        loadPosts();
    };

    // Get initial letter for avatar placeholder
    const getInitial = (title) => {
        return title ? title.charAt(0).toUpperCase() : "P";
    };

    // Format timestamp (placeholder function - replace with actual date formatting)
    const formatDate = (timestamp) => {
        // This is just a placeholder. In a real app, you'd use the post's timestamp
        return "3 hours ago";
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
                                    <p className="post-author-name">User</p>
                                    <p className="post-timestamp">{formatDate(post.createdAt)}</p>
                                </div>
                            </div>
                            
                            <div className="post-content">
                                <h3 className="post-title">{post.title}</h3>
                                <p>{post.content.length > 250 
                                    ? post.content.substring(0, 250) + '...' 
                                    : post.content}
                                </p>
                            </div>
                            
                            <div className="post-engagement">
                                <div className="post-likes">
                                    <span className="likes-icon"><i className="bi bi-hand-thumbs-up-fill"></i></span>
                                    <span>{post.likes?.length || 0}</span>
                                </div>
                                <div className="post-comments-count">
                                    {Math.floor(Math.random() * 10)} comments
                                </div>
                            </div>
                            
                            <div className="post-actions">
                                <button className="post-action-btn">
                                    <i className="bi bi-hand-thumbs-up"></i> Like
                                </button>
                                <button className="post-action-btn">
                                    <i className="bi bi-chat"></i> Comment
                                </button>
                                <button className="post-action-btn">
                                    <i className="bi bi-share"></i> Share
                                </button>
                            </div>
                            
                            {/* Added action buttons similar to previous design */}
                            <div className="post-buttons">
                                <Link to={`/view-post/${post.id}`} className="post-btn post-btn-view">
                                    <i className="bi bi-eye"></i> View
                                </Link>
                                <Link to={`/edit-post/${post.id}`} className="post-btn post-btn-edit">
                                    <i className="bi bi-pencil"></i> Edit
                                </Link>
                                <button className="post-btn post-btn-delete" onClick={() => deletePost(post.id)}>
                                    <i className="bi bi-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}