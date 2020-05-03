import React from 'react';
import './footer.scss';

export interface FooterProps {

}


const Footer:React.FC<FooterProps> = () => {
  return (
    <footer className="footer">
      <div className="content content_align_horisontal">
        <div className="footer__info">
          <a className="text text_size_xs text_view_link">Support</a>
          <a className="text text_size_xs text_view_link">Learning</a>
        </div>
        <span className="text text_size_xs text_view_ghost">© 2020 Your Name</span>
      </div>
    </footer>
  );
}
export default Footer;
