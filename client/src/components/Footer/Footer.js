import React from 'react';
import "./Footer.css"

const Footer = () => {
  return (
    <footer className='footer-parent'>
      <b>All rights reserved @2023 Book Shelve System</b>
      <ul className="social-icons">
        <li>
          <a href="https://www.facebook.com">Facebook
            <i className="fab fa-facebook"></i>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com">Linkedin
            <i className="fab fa-linkedin"></i>
          </a>
        </li>
        <li>
          <a href="https://www.whatsapp.com">whatsapp
            <i className="fab fa-whatsapp"></i>
          </a>
        </li>
        <li>
          <a href="mailto:example@gmail.com">Gmail
            <i className="fas fa-envelope"></i>
          </a>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
