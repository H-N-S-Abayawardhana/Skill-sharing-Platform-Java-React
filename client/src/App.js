import React from 'react';
import {Route,Routes} from "react-router";
import Home from './Pages/Home';
import AddLearningPlan from './Pages/LearningPlan/AddLearningPlan';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';







function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />
          <Route path="/Profile" element={<Profile/>} />

          <Route path="/learning-plan" element={<h1>Learning Plan</h1>} />
          <Route path="/learning-plan/add" element={<AddLearningPlan/>} />
          <Route path="/learning-plan/:id" element={<h1>Learning Plan Detail</h1>} />
        </Routes>
      </React.Fragment>

    </div>
  );
}

export default App;
