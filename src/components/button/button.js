import React from 'react';
import Icon from '../icon';
import './button.scss';


function Button(
    {
      icon, text, size, type,
      className, adaptive,
      children, onClick, ...props
    }) {
  text = text || children;
  const classes = [
    'button',
    size ? `button_size_${size}` : '',
    type ? `button_type_${type}` : '',
    adaptive ? 'button_adaptive': '',
    className || ''
  ];
  return (
    <button
      className={classes.join(' ')}
      disabled={type === 'disabled'}
      {...props}
      onClick={() => onClick && onClick()}
    >
      { icon ? <Icon icon={icon}></Icon> : null }
      { text ? <span className="button__text">{text}</span> : null }
    </button>
  );
}
export default Button;
