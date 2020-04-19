import React from 'react';
import './code-presenter.scss';

function CodePresentor({code, children, className}) {
  code = code || children;
  const classes = [
    'code-presenter',
    className || ''
  ];
  return (
    <div
      className={classes.join(' ')}
      dangerouslySetInnerHTML={{__html: code}}
    />
  );
}
export default CodePresentor;
