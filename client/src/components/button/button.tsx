import React, {useCallback} from 'react';
import Icon from '../icon';
import cn from '../../utils/class-name';
import './button.scss';

export type ButtonTypes = 'action' | 'control' | 'disabled';

export interface ButtonProps {
  icon?:string
  text?:string
  size?:'s'|'m'
  type?:ButtonTypes
  adaptive?: boolean
  className?:string
  onClick?():void
}


const Button:React.FC<ButtonProps> = (
    {
      icon, text, size, type,
      className, adaptive,
      children, onClick, ...props
    }) => {
  text = text || children?.toString();
  const classes = [
    cn('button')({size, type, adaptive}),
    className || ''
  ];
  const onClickHandler = useCallback(() => onClick && onClick(), [onClick]);
  return (
    <button
      className={classes.join(' ')}
      disabled={type === 'disabled'}
      {...props}
      onClick={onClickHandler}
    >
      { icon ? <Icon icon={icon}></Icon> : null }
      { text ? <span className={cn('button')('text')}>{text}</span> : null }
    </button>
  );
}
export default Button;
