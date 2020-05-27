import React from 'react';
import Icon from '../icon';
import ExtendIcon from '../extend-icon';
import cn from '../../utils/class-name';
import {formatISODate, countDuration} from '../../utils/date-formatter';
import { useTranslation } from 'react-i18next';
import './card.scss';
import { Build } from '../../../../server/src/services/rest/build-dto';

const StatusMap = new Map(Object.entries({
  waiting: 'panding',
  inprogress: 'panding',
  success: 'done',
  fail: 'fail',
  canceled: 'fail'
}));

export interface CardProps {
  className?:string
  clickable?:boolean
  view?:string
  data:Build
}

const Card:React.FC<CardProps> = ({className, clickable, view, data}) => {
  const { t, i18n } = useTranslation();
  const {
    buildNumber, commitMessage, commitHash,
    branchName, authorName, status, start, duration
  } = data;
  const classes = [
    cn('card')({
      view,
      type: StatusMap.get(status.toLowerCase()) || 'panding',
      clickable
    }),
    className || ''
  ];
  return (
    <div className={classes.join(' ')}>
      <Icon icon="done" size="xl" className={cn('card')('icon')}></Icon>
      <div className="card__body">
        <span className="card__title">
          <span className="card__id">#{buildNumber}</span>
          {commitMessage}
        </span>
        <div className="card__content">
          <ExtendIcon
            icon="code-commit"
            label={branchName}
            subLabel={commitHash}
          />
          <ExtendIcon icon="user">{authorName}</ExtendIcon>
        </div>
      </div>
      <div className="card__meta">
        <ExtendIcon icon="calendar">{formatISODate(start, i18n.language as any)}</ExtendIcon>
        <ExtendIcon icon="stopwatch">{countDuration(duration, i18n.language as any)}</ExtendIcon>
      </div>
    </div>
  );
}
export default Card;
