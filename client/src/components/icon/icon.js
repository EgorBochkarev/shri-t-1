import React from 'react';
import './icon.scss';

function Icon({icon, className, size, ...props}) {
  const classes = [
    'icon',
    size ? `icon_size_${size}` : '',
    className || ''
  ];
  return (
    <svg className={classes.join(' ')} {...props}>
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  );
}
export default Icon;
