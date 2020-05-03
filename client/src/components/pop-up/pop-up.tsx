import React from 'react';
import ReactDOM from 'react-dom';
import './pop-up.scss';

export interface PopUpProps {
  show?: boolean
  title?:string
}

const PopUp:React.FC<PopUpProps> = ({children, show, title}) => {
  const el = document.getElementById('pop-up');
  if (!show || !el) {
    return null;
  }
  return ReactDOM.createPortal(
      <div className="pop-up__background">
        <div className="pop-up__content">
          <div className="pop-up__title">{title}</div>
          <div className="pop-up__body">{children}</div>
        </div>
      </div>,
      el
  );
}
export default PopUp;
