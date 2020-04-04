import React from 'react';
import Icon from '../icon';
import cn from '../../utils/class-name';
import './button.scss';


function Button(
    {
      icon, text, size, type,
      className, adaptive,
      children, onClick, ...props
    }) {
  text = text || children;
  const classes = [
    cn('button')({size, type, adaptive}),
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
      { text ? <span className={cn('button')('text')}>{text}</span> : null }
    </button>
  );
}
export default Button;
