import React from 'react';
import Icon from '../icon';
import ExtendIcon from '../extend-icon';
import cn from '../../utils/class-name';
import './card.scss';

const StatusMap = {
  waiting: 'panding',
  inprogress: 'panding',
  success: 'done',
  fail: 'fail',
  canceled: 'fail'
};

function Card({className, clickable, view, data}) {
  const {buildNumber, commitMessage, commitHash, branchName, authorName, status, start, duration} = data;
  const classes = [
    cn('card')({
      view,
      type: StatusMap[status.toLowerCase()] || 'panding',
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
          <ExtendIcon icon="code-commit" label={branchName} subLabel={commitHash}/>
          <ExtendIcon icon="user">{authorName}</ExtendIcon>
        </div>
      </div>
      <div className="card__meta">
        <ExtendIcon icon="calendar">{start}</ExtendIcon>
        <ExtendIcon icon="stopwatch">{duration}</ExtendIcon>
      </div>
    </div>
  );
}
export default Card;
