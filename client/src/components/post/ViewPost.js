import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/ViewPost.css';

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
        const isImage = /\.(jpeg|jpg|gif|png)$/i.test(url);
        const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

        if (isImage) {
            return (
                <img 
                    src={url} 
                    alt="Post media" 
                    className="img-fluid media-item"
                />
            );
        } else if (isVideo) {
            return (
                <video 
                    src={url} 
                    controls 
                    className="img-fluid media-item"
                />
            );
        } else {
            return (
                <div className="p-3 border rounded bg-light text-center media-item">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        <i className="bi bi-file-earmark me-1"></i> View Attachment
                    </a>
                </div>
            );
        }
    };

    return (
        <div className="viewpost-container">
            <div className="viewpost-wrapper">
                <h2 className="viewpost-title">{post.title}</h2>

                {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div className="viewpost-media mb-4 row g-3">
                        {post.mediaUrls.map((url, index) => (
                            <div 
                                key={index} 
                                className={`col-md-${12 / Math.min(post.mediaUrls.length, 3)} col-sm-12`}
                            >
                                {renderMedia(url)}
                            </div>
                        ))}
                    </div>
                )}

                <div className="viewpost-content">
                    <p>{post.content}</p>
                </div>

                {post.tags.length > 0 && (
                    <div className="viewpost-tags mb-3">
                        <h5>Tags:</h5>
                        <div>
                            {post.tags.map((tag, index) => (
                                <span key={index} className="badge me-1">{tag}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="viewpost-actions">
                    <button
                        className={`btn ${post.likes.includes(userId) ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={handleLike}
                    >
                        <i className="bi bi-hand-thumbs-up-fill me-1"></i> {post.likes.length}
                    </button>

                    <div>
                        <Link to={`/edit-post/${post.id}`} className="btn btn-outline-primary me-2">Edit</Link>
                        <Link to="/posts" className="btn btn-secondary">Back</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
