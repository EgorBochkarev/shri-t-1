import {Link} from 'react-router-dom';
import React from 'react';
import './header.scss';

export interface HeaderProps {
  title?:string
}

const Header:React.FC<HeaderProps> = ({title, children}) => {
  const titleClass = `header__title ${title ? '' : ' text_view_ghost'}`;
  return (
    <header className="header">
      <div className="content content_align_horisontal">
        <Link to="/history">
          <h1 className={titleClass}>{title}</h1>
        </Link>
        { children ? <div className="header__tools">{children}</div> : null }
      </div>
    </header>
  );
}
export default Header;
