import React from 'react';
import {Route,Routes} from "react-router";
import Home from './pages/Home';
import AddLearningPlan from './pages/LearningPlan/AddLearningPlan';




//import Home from "./pages/Home";


function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning-plan" element={<h1>Learning Plan</h1>} />
          <Route path="/learning-plan/add" element={<AddLearningPlan/>} />
          <Route path="/learning-plan/:id" element={<h1>Learning Plan Detail</h1>} />
        </Routes>
      </React.Fragment>

    </div>
  );
}

export default App;
