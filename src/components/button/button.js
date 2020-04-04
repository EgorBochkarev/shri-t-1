import React, {useState, useEffect} from 'react';
import Icon from '../icon';
import './button.scss';


function Button({icon, text, size, type, className, adaptive, children, onClick, ...props}) {
  text = text || children;
  const classes = [
    'button',
    size ? `button_size_${size}` : '',
    type ? `button_type_${type}` : '',
    className || ''
  ];
  return (
    <button className={classes.join(' ')} disabled={type === 'disabled'} {...props} onClick={() => onClick && onClick()}>
      { icon && <Icon icon={icon}></Icon> }
      { text && <span className={'text text_size_xxs button__text' + (adaptive ? ' button__text_adaptive' : '')}>{text}</span> }
    </button>
  );
}
export default Button;
