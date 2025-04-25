import React from 'react';
import { Route, Routes } from "react-router-dom";

import Home from './Pages/Home';
import AddLearningPlan from './Pages/LearningPlan/AddLearningPlan';
import EditLearningPlan from './Pages/LearningPlan/EditLearningPlan';
import ViewLearningPlan from './Pages/LearningPlan/ViewLearningPlan';





function App() {
  return (
    <div>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning-plan" element={<h1>Learning Plan</h1>} />
          <Route path="/learning-plan/add" element={<AddLearningPlan/>} />
          <Route path="/edit-learning-plan/:id" element={<EditLearningPlan />} />
          <Route path="/view-learning-plan/:id" element={<ViewLearningPlan />} />
        </Routes>
      

    </div>
  );
}

export default App;
