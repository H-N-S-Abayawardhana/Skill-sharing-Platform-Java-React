import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import AddLearningPlan from './Pages/LearningPlan/AddLearningPlan';

import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';






import EditLearningPlan from './Pages/LearningPlan/EditLearningPlan';
import ViewLearningPlan from './Pages/LearningPlan/ViewLearningPlan';
import ViewLearningPlans from './Pages/LearningPlan/ViewLearningPlans';


import PostsList from './components/post/PostsList';
import AddPost from './components/post/AddPost';
import EditPost from './components/post/EditPost';
import ViewPost from './components/post/ViewPost';



function App() {
  return (
    <div>
      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />
          <Route path="/Profile" element={<Profile/>} />

          <Route path="/learning-plan" element={<h1>Learning Plan</h1>} />
          <Route path="/learning-plan/add" element={<AddLearningPlan/>} />
          <Route path="/edit-learning-plan/:id" element={<EditLearningPlan />} />
          <Route path="/view-learning-plan/:id" element={<ViewLearningPlan />} />
          <Route path="/view-learning-plans" element={<ViewLearningPlans/>}/>

            <Route path="/posts" element={<PostsList />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/view-post/:id" element={<ViewPost />} />
        </Routes>
      

    </div>
  );
}

export default App;
