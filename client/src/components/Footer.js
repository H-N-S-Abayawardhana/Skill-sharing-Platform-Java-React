import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';
import '../css/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Brand Section */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span className="footer-skill-text">Skill</span>
                <span className="footer-tribe-text">Tribe</span>
              </Link>
              <p className="footer-about">
                SkillTribe helps you create, track, and share your learning journey with a
                community of like-minded learners.
              </p>
              <div className="footer-social">
                <a href="#" className="social-icon">
                  <Facebook size={18} />
                </a>
                <a href="#" className="social-icon">
                  <Twitter size={18} />
                </a>
                <a href="#" className="social-icon">
                  <Instagram size={18} />
                </a>
                <a href="#" className="social-icon">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-links">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links-list">
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/">Home</Link>
                </li>
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/view-learning-plans">Learning Plans</Link>
                </li>
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/PostsListrandomuser">Community Posts</Link>
                </li>
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/about">About Us</Link>
                </li>
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Learning Resources */}
            <div className="footer-links">
              <h3 className="footer-title">Learning Resources</h3>
              <ul className="footer-links-list">
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/templates">Plan Templates</Link>
                </li>
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/guides">Learning Guides</Link>
                </li>
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/resources">Free Resources</Link>
                </li>
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/faq">FAQ</Link>
                </li>
                <li className="footer-link-item">
                  <ChevronRight size={14} />
                  <Link to="/support">Support</Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-contact">
              <h3 className="footer-title">Contact Us</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>123 Learning Street, Education City</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <span>contact@skilltribe.com</span>
                </div>
              </div>
              
              <div className="footer-newsletter">
                <h4 className="newsletter-title">Subscribe to Newsletter</h4>
                <div className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="newsletter-input" 
                  />
                  <button className="newsletter-btn">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} SkillTribe. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;