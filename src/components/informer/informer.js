import React from 'react';
import Icon from '../icon';
import './informer.scss';


function Informer({icon, text, className, children}) {
  const classes = [
    'informer',
    className || ''
  ];
  return (
    <div className={classes.join(' ')}>
      <Icon icon={icon} size="xxl" className="informer__icon"></Icon>
      <span className="text text_size_xxs informer__text">{text}</span>
      {children}
    </div>
  );
}
export default Informer;
