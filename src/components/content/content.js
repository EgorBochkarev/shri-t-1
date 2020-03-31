import React from 'react';
import './content.scss';

function Content({className, loading = false, children, type, fullAdaptive}) {
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
