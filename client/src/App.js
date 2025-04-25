import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import AddLearningPlan from './pages/LearningPlan/AddLearningPlan';
import EditLearningPlan from './pages/LearningPlan/EditLearningPlan';
import ViewLearningPlan from './pages/LearningPlan/ViewLearningPlan';

import PostsList from './Components/post/PostsList';
import AddPost from './Components/post/AddPost';
import EditPost from './Components/post/EditPost';
import ViewPost from './Components/post/ViewPost';


function App() {
  return (
    <div>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning-plan" element={<h1>Learning Plan</h1>} />
          <Route path="/learning-plan/add" element={<AddLearningPlan/>} />
          <Route path="/edit-learning-plan/:id" element={<EditLearningPlan />} />
          <Route path="/view-learning-plan/:id" element={<ViewLearningPlan />} />

            <Route path="/posts" element={<PostsList />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/view-post/:id" element={<ViewPost />} />
        </Routes>
      

    </div>
  );
}

export default App;
