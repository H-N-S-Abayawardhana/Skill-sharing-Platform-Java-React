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

    return (
        <div className="postlist-container">
        <div className="postlist-header">
            <h2 className="postlist-title">Posts</h2>
            <Link to="/add-post" className="postlist-add-btn">Add Post</Link>
        </div>
    
        {posts.length === 0 ? (
            <div className="postlist-empty">No posts available. Create your first post!</div>
        ) : (
            <div className="postlist-grid">
                {posts.map((post) => (
                    <div key={post.id} className="postlist-grid-item">
                        <div className="postlist-card">
                            <div className="postlist-card-body">
                                <h5 className="postlist-card-title">{post.title}</h5>
                                <p className="postlist-card-text">
                                    {post.content.length > 100 
                                        ? post.content.substring(0, 100) + '...' 
                                        : post.content}
                                </p>
                            </div>
                            <div className="postlist-card-footer">
                                <span className="postlist-likes">
                                    <i className="bi bi-hand-thumbs-up"></i> {post.likes.length}
                                </span>
                                <div className="postlist-actions">
                                    <Link to={`/view-post/${post.id}`} className="btn btn-sm postlist-btn-view">
                                        View
                                    </Link>
                                    <Link to={`/edit-post/${post.id}`} className="btn btn-sm postlist-btn-edit">
                                        Edit
                                    </Link>
                                    <button className="btn btn-sm postlist-btn-delete" onClick={() => deletePost(post.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
    

    );
}