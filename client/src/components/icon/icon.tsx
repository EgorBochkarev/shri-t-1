import React from 'react';
import './icon.scss';
import className from '../../utils/class-name';

export interface IconProps {
  icon:string
  className?:string
  size?:'l'|'xl'|'xxl'
  onClick?():void
}

const Icon:React.FC<IconProps> = ({icon, className, size, ...props}) => {
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
