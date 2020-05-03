import React from 'react';
import './content.scss';

export interface ButtonProps {
  className?:string
  loading?: boolean
  type?:string
  fullAdaptive?:boolean
}

const Content:React.FC<ButtonProps> = ({className, loading = false, type, fullAdaptive, children}) => {
  const classes = [
    'content',
    type ? `content_type_${type}` : '',
    fullAdaptive && 'content_full-adaptive',
    className || ''
  ];
  return (
    <div className={classes.join(' ')}>
      {loading ? <div>Loading...</div> : children}
    </div>
  );
}
export default Content;
