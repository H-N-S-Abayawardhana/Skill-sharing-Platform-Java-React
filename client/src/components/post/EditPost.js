import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    
    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        loadPost();
    }, []);
    
    const loadPost = async () => {
        const result = await axios.get(`http://localhost:8080/api/posts/${id}`);
        const post = result.data;
        setTitle(post.title);
        setContent(post.content);
        setTags(post.tags.join(', '));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const updatedPost = {
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim())
        };
        
        await axios.put(`http://localhost:8080/api/posts/${id}`, updatedPost);
        navigate('/posts');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Edit Post</h2>
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
                        <button type="submit" className="btn btn-primary">Update</button>
                        <Link to="/posts" className="btn btn-danger mx-2">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}