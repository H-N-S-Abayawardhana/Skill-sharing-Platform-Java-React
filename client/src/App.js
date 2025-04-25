import React from 'react';
import { Route, Routes } from "react-router-dom";

import Home from './Pages/Home';
import AddLearningPlan from './Pages/LearningPlan/AddLearningPlan';





function App() {
  return (
    <div>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning-plan" element={<h1>Learning Plan</h1>} />
          <Route path="/learning-plan/add" element={<AddLearningPlan/>} />
          <Route path="/learning-plan/:id" element={<h1>Learning Plan Detail</h1>} />
        </Routes>
      

    </div>
  );
}

export default App;
