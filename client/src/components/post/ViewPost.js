// src/components/Post/ViewPost.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ViewPost() {
    const [post, setPost] = useState({
        title: '',
        content: '',
        tags: [],
        likes: [],
        mediaUrls: []
    });
    
    const { id } = useParams();
    
    // For demo purposes, hardcoded userId
    const userId = 1;
    
    useEffect(() => {
        loadPost();
    }, []);
    
    const loadPost = async () => {
        const result = await axios.get(`http://localhost:8080/api/posts/${id}`);
        setPost(result.data);
    };
    
    const handleLike = async () => {
        const isLiked = post.likes.includes(userId);
        
        if (isLiked) {
            await axios.put(`http://localhost:8080/api/posts/${id}/unlike/${userId}`);
        } else {
            await axios.put(`http://localhost:8080/api/posts/${id}/like/${userId}`);
        }
        
        loadPost();  // Reload post after like/unlike
    };
    
    const renderMedia = (url) => {
        // Check if it's an image or video based on file extension
        const isImage = /\.(jpeg|jpg|gif|png)$/i.test(url);
        const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
        
        if (isImage) {
            return (
                <img 
                    src={url} 
                    alt="Post media" 
                    className="img-fluid rounded" 
                    style={{ maxHeight: '400px' }}
                />
            );
        } else if (isVideo) {
            return (
                <video 
                    src={url} 
                    controls 
                    className="img-fluid rounded"
                    style={{ maxHeight: '400px', width: '100%' }}
                />
            );
        } else {
            return (
                <div className="p-3 border rounded">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-file-earmark"></i> Attachment
                    </a>
                </div>
            );
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">{post.title}</h2>
                    
                    {post.mediaUrls && post.mediaUrls.length > 0 && (
                        <div className="mb-4">
                            <div className="row">
                                {post.mediaUrls.map((url, index) => (
                                    <div key={index} className={`col-md-${12 / Math.min(post.mediaUrls.length, 3)} mb-3`}>
                                        {renderMedia(url)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="card mb-3">
                        <div className="card-body">
                            <p className="card-text">{post.content}</p>
                        </div>
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                        <div className="mb-3">
                            <h5>Tags:</h5>
                            <div>
                                {post.tags.map((tag, index) => (
                                    <span key={index} className="badge bg-secondary me-1">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="d-flex justify-content-between">
                        <div>
                            <button 
                                className={`btn ${post.likes.includes(userId) ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={handleLike}
                            >
                                <i className="bi bi-hand-thumbs-up"></i> {post.likes.length}
                            </button>
                        </div>
                        <div>
                            <Link to={`/edit-post/${post.id}`} className="btn btn-outline-primary mx-2">Edit</Link>
                            <Link to="/posts" className="btn btn-secondary">Back</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}