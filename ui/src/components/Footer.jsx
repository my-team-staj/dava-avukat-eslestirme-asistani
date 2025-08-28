import React from "react";
import { FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import "../App.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-section">
          <h4>LeXMatchGun</h4>
          <p>Yapay zeka destekli akıllı dava-avukat eşleştirme platformu</p>
        </div>
        
        <div className="footer-section">
          <h4>Hızlı Linkler</h4>
          <ul>
            <li><a href="/case-add">Dava Ekle</a></li>
            <li><a href="/lawyer-add">Avukat Ekle</a></li>
            <li><a href="/cases">Dava Listesi</a></li>
            <li><a href="/lawyers">Avukat Listesi</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>İletişim</h4>
          <div className="contact-item">
            <FaEnvelope style={{ marginRight: 8 }} />
            <a href="mailto:lexmatchgun@lexgun.com">lexmatchgun@lexgun.com</a>
          </div>
          <div className="contact-item">
            <FaPhone style={{ marginRight: 8 }} />
            <a href="tel:08504023726">0850 402 37 26</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Sosyal Medya</h4>
          <div className="social-links">
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <small>
          &copy; {new Date().getFullYear()} LeXMatchGun — Akıllı Dava-Avukat Eşleştirme Asistanı
        </small>
      </div>
    </footer>
  );
}

export default Footer;
