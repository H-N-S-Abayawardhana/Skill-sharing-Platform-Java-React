import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
        <div className="container">
            <div className="py-4">
                <div className="d-flex justify-content-between mb-4">
                    <h2>Posts</h2>
                    <Link to="/add-post" className="btn btn-primary">Add Post</Link>
                </div>
                
                {posts.length === 0 ? (
                    <div className="alert alert-info">No posts available. Create your first post!</div>
                ) : (
                    <div className="row">
                        {posts.map((post) => (
                            <div key={post.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <p className="card-text">
                                            {post.content.length > 100 
                                                ? post.content.substring(0, 100) + '...' 
                                                : post.content}
                                        </p>
                                    </div>
                                    <div className="card-footer bg-white">
                                        <div className="d-flex justify-content-between">
                                            <span>
                                                <i className="bi bi-hand-thumbs-up"></i> {post.likes.length}
                                            </span>
                                            <div>
                                                <Link to={`/view-post/${post.id}`} className="btn btn-sm btn-outline-primary me-2">
                                                    View
                                                </Link>
                                                <Link to={`/edit-post/${post.id}`} className="btn btn-sm btn-outline-secondary me-2">
                                                    Edit
                                                </Link>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deletePost(post.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}