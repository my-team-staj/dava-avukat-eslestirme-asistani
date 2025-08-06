import React from "react";
import "../App.css";


function Footer() {
  return (
    <footer className="footer">
      <div>
        <small>
          &copy; {new Date().getFullYear()} LeXMatchGun — Akıllı Dava-Avukat Eşleştirme Asistanı
        </small>
      </div>
      <div className="footer-contact">
        <span>İletişim: </span>
        <a href="mailto:lexmatchgun@lexgun.com">lexmatchgun@lexgun.com</a> |{" "}
        <a href="tel:08504023726">0850 402 37 26</a>
      </div>
    </footer>
  );
}

export default Footer;
