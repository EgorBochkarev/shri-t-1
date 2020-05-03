import React, { PropsWithChildren } from 'react';
import Button from '../button';
import './list.scss';

export interface ListProps<T> {
  className?:string
  clickable?:boolean
  data:T[]
  renderItem(data:T):JSX.Element
  showMore():void
}

const List = <T extends object,>({className, clickable, data, renderItem, showMore}:PropsWithChildren<ListProps<T>>) => {
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
