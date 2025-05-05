import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import AddLearningPlan from './Pages/LearningPlan/AddLearningPlan';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import UpdateProfile from './Pages/UpdateProfile';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import EditLearningPlan from './Pages/LearningPlan/EditLearningPlan';
import ViewLearningPlan from './Pages/LearningPlan/ViewLearningPlan';
import ViewLearningPlans from './Pages/LearningPlan/ViewLearningPlans';
//import PostsList from './components/post/PostsList';
import PostsList from './components/post/PostsListrandomuser';
import AddPost from './components/post/AddPost';
import EditPost from './components/post/EditPost';
import ViewPost from './components/post/ViewPost';
import PostsListS from './components/post/PostListSystemUser';

function App() {
  return (
    <div>
      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />  
          <Route path="/Login" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/Profile" element={<Profile/>} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/learning-plan" element={<h1>Learning Plan</h1>} />
          <Route path="/learning-plan/add" element={<AddLearningPlan/>} />
          <Route path="/edit-learning-plan/:id" element={<EditLearningPlan />} />
          <Route path="/view-learning-plan/:id" element={<ViewLearningPlan />} />
          <Route path="/view-learning-plans" element={<ViewLearningPlans/>}/>
          <Route path="/PostsListrandomuser" element={<PostsList />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/view-post/:id" element={<ViewPost />} />
          <Route path="/PostListSystemUser" element={<PostsListS />} />
        </Routes>
      

    </div>
  );
}

export default App;
