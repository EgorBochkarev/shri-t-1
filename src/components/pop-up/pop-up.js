import React from 'react';
import ReactDOM from 'react-dom';
import './pop-up.scss';


function PopUp({children, show, title, onApply}) {
  if (!show) {
    return null;
  }
  return ReactDOM.createPortal(
      <div className="pop-up__background">
        <div className="pop-up__content">
          <div className="pop-up__title text text_size_xl">{title}</div>
          <div className="pop-up__body">{children}</div>
        </div>
      </div>,
      document.getElementById('pop-up'),
  );
}
export default React.memo(PopUp);
