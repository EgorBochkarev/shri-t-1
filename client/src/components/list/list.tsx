import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const classes = [
    'list',
    clickable ? `list_clicable` : '',
    className || ''
  ];
  return (
    <div className={classes.join(' ')}>
      {data.map((data) => renderItem(data))}
      <Button size="s" className="list__button" onClick={showMore}>{t('Show more')}</Button>
    </div>
  );
}
export default List;
