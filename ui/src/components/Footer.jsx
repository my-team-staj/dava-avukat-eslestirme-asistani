import React from "react";
import { FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import "../App.css";

function Footer() {
  return (
    <footer className="footer" style={{
      backgroundColor: 'var(--bg-footer)',
      color: 'white'
    }}>
      <div className="footer-main">
        <div className="footer-section">
          <h4>lexpert</h4>
          <p>Yapay zeka destekli akıllı dava-avukat eşleştirme platformu</p>
        </div>
        
        <div className="footer-section">
          <h4>Hızlı Linkler</h4>
          <ul>
            <li><a href="/case-add" style={{color: 'white'}}>Dava Ekle</a></li>
            <li><a href="/lawyer-add" style={{color: 'white'}}>Avukat Ekle</a></li>
            <li><a href="/cases" style={{color: 'white'}}>Dava Listesi</a></li>
            <li><a href="/lawyers" style={{color: 'white'}}>Avukat Listesi</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>İletişim</h4>
          <div className="contact-item">
            <FaEnvelope style={{ marginRight: 8, color: 'white' }} />
            <a href="mailto:info@lexpert.com" style={{color: 'white'}}>info@lexpert.com</a>
          </div>
          <div className="contact-item">
            <FaPhone style={{ marginRight: 8, color: 'white' }} />
            <a href="tel:08504023726" style={{color: 'white'}}>0850 402 37 26</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Sosyal Medya</h4>
          <div className="social-links">
            <a href="#" aria-label="LinkedIn" className="social-icon"><FaLinkedin /></a>
            <a href="#" aria-label="Twitter" className="social-icon"><FaTwitter /></a>
            <a href="#" aria-label="GitHub" className="social-icon"><FaGithub /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <small>
          &copy; {new Date().getFullYear()} lexpert — Akıllı Hukuk Platformu
        </small>
      </div>
    </footer>
  );
}

export default Footer;
