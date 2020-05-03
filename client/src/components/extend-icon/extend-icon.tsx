import React from 'react';
import './extend-icon.scss';

export interface ExtendIconProps {
  icon:string
  label?:string
  subLabel?:string
}

const ExtendIcon:React.FC<ExtendIconProps> = ({icon, label, subLabel, children}) => {
  label = label || children?.toString();
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
