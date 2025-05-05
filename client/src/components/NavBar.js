import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/NavBar.css';

const NavBar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <a className="navbar-brand" href="/">
          <span>SkillTribe</span>
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent" 
          aria-controls="navbarContent" 
          aria-expanded={!isNavCollapsed ? true : false} 
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            
            <li className="nav-item dropdown navbar-dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="learningDropdown" 
                role="button"
              >
                Learning Plans
              </a>
              <ul className="dropdown-menu" aria-labelledby="learningDropdown">
                <li><a className="dropdown-item" href="/learning-plan/add">Add Learning Plan</a></li>
                <li><a className="dropdown-item" href="/view-learning-plans">View Learning Plans</a></li>
              </ul>
            </li>
            
            <li className="nav-item dropdown navbar-dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="postsDropdown" 
                role="button"
              >
                Posts
              </a>
              <ul className="dropdown-menu" aria-labelledby="postsDropdown">
                <li><a className="dropdown-item" href="/add-post">Add Posts</a></li>
                <li><a className="dropdown-item" href="/PostsListrandomuser">View Posts</a></li>
              </ul>
            </li>
          </ul>
          
          <div className="navbar-auth d-flex align-items-center">
            <button className="btn btn-outline-light me-2">Sign In</button>
            <button className="btn btn-accent">Sign Up</button>
            <div className="navbar-profile ms-3">
              <div className="profile-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;