import React from 'react';
import './code-presenter.scss';

function CodePresentor({code, children, className}) {
  code = code || children;
  const classes = [
    'code-presenter',
    className || ''
  ];
  return (
    <pre className={classes.join(' ')}>{code}</pre>
  );
}
export default CodePresentor;
