import React from 'react';
import './header.scss';


function Header({title, children}) {
  const titleClass = `header__title text text_size_l text_weight_medium${title ? '' : ' text_view_ghost'}`;
  title = title || 'School CI server';
  return (
    <header className="header">
      <div className="content content_align_horisontal">
        <h1 className={titleClass}>{title}</h1>
        { children && <div className="header__tools">{children}</div> }
      </div>
    </header>
  );
}
export default Header;
