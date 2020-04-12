import React from 'react';
import Button from '../button';
import './list.scss';

function List({className, clickable, data, renderItem, showMore}) {
  const classes = [
    'list',
    clickable ? `list_clicable` : '',
    className || ''
  ];
  return (
    <div className={classes.join(' ')}>
      {data.map((data) => renderItem(data))}
      <Button size="s" className="list__button" onClick={showMore}>Show more</Button>
    </div>
  );
}
export default List;
