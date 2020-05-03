import React from 'react';
import './code-presenter.scss';

export interface CodePresentorProps {
  code?:string
  className?:string
}

const CodePresentor:React.FC<CodePresentorProps> = ({code, className, children}) => {
  code = code || children?.toString();
  const classes = [
    'code-presenter',
    className || ''
  ];
  return (
    <div
      className={classes.join(' ')}
      dangerouslySetInnerHTML={{__html: code || ''}}
    />
  );
}
export default CodePresentor;
