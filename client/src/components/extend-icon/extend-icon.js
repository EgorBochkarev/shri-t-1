import React from 'react';
import './extend-icon.scss';

function ExtendIcon({icon, label, subLabel, children}) {
  label = label || children;
  return (
    <div className="extend-icon">
      <svg className="icon icon_size_l extend-icon__icon">
        <use xlinkHref={`#${icon}`}></use>
      </svg>
      <span className="extend-icon__label">{label}</span>
      <span className="extend-icon__sub-label">{subLabel}</span>
    </div>
  );
}
export default ExtendIcon;
