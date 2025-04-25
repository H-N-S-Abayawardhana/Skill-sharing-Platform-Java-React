// src/components/Post/AddPost.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [files, setFiles] = useState([]);
    const [mediaUrls, setMediaUrls] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    
    // For demo purposes, hardcoded userId
    const userId = 1;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        // Validate file count
        if (selectedFiles.length > 3) {
            setError('Maximum 3 files allowed');
            return;
        }
        
        setFiles(selectedFiles);
        setError('');
    };
    
    const uploadFiles = async () => {
        if (files.length === 0) return [];
        
        try {
            setUploading(true);
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });
            
            const response = await axios.post('http://localhost:8080/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setUploading(false);
            return response.data;
        } catch (error) {
            setUploading(false);
            setError('Error uploading files');
            console.error('Upload error:', error);
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (files.length > 3) {
            setError('Maximum 3 files allowed');
            return;
        }
        
        // Upload files first if there are any
        const uploadedUrls = files.length > 0 ? await uploadFiles() : [];
        
        if (error) return;
        
        const newPost = {
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()),
            mediaUrls: uploadedUrls,
            userId
        };
        
        try {
            await axios.post('http://localhost:8080/api/posts', newPost);
            navigate('/posts');
        } catch (error) {
            setError('Error creating post');
            console.error('Post creation error:', error);
        }
    };
    
    const renderPreview = () => {
        if (files.length === 0) return null;
        
        return (
            <div className="mt-3">
                <h5>Preview:</h5>
                <div className="row">
                    {files.map((file, index) => (
                        <div key={index} className="col-md-4 mb-2">
                            {file.type.startsWith('image/') ? (
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={`Preview ${index}`} 
                                    className="img-thumbnail" 
                                    style={{ height: '150px', objectFit: 'cover' }}
                                />
                            ) : file.type.startsWith('video/') ? (
                                <video 
                                    src={URL.createObjectURL(file)}
                                    controls
                                    className="img-thumbnail"
                                    style={{ height: '150px', width: '100%' }}
                                />
                            ) : (
                                <div className="p-3 border rounded">
                                    <i className="bi bi-file-earmark"></i> {file.name}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Create Post</h2>
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="Title" className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter post title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="Content" className="form-label">Content</label>
                            <textarea
                                className="form-control"
                                placeholder="Enter your post content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows="5"
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="Tags" className="form-label">Tags (comma separated)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="Media" className="form-label">Media (Max 3 files)</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                                multiple
                                accept="image/*, video/*"
                            />
                            <div className="form-text">
                                You can upload up to 3 images or videos
                            </div>
                        </div>
                        
                        {renderPreview()}
                        
                        <div className="mt-4">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : 'Submit'}
                            </button>
                            <Link to="/posts" className="btn btn-danger mx-2">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}