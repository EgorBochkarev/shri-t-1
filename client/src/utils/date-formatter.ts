import {format, formatDistanceStrict, sub} from 'date-fns';
import {ru} from 'date-fns/locale';

const formatISODate = (timeISO?:string) => {
  return timeISO && format(new Date(timeISO), 'd LLL HH:mm', {locale: ru})
};
const countDuration = (durationInMiliseconds?:string) => {
  if (!durationInMiliseconds) {
    return durationInMiliseconds;
  }
  const fakeStartDate = new Date();
  const secondsDuration = Math.floor(
      Number.parseInt(durationInMiliseconds) / 1000
  );
  const clearHours = Math.floor(secondsDuration / (60 * 60));
  const clearMins = Math.floor((secondsDuration / 60) - clearHours * 60);
  const clearSec = Math.floor(
      secondsDuration - clearHours * 60 * 60 - clearMins * 60
  );
  const result = [];
  if (clearHours > 0) {
    result.push(formatDistanceStrict(fakeStartDate, sub(fakeStartDate, {
      hours: clearHours
    }), {locale: ru, unit: 'hour'}));
  }
  if (clearMins > 0) {
    result.push(formatDistanceStrict(fakeStartDate, sub(fakeStartDate, {
      minutes: clearMins
    }), {locale: ru, unit: 'minute'}));
  }
  if (clearHours === 0 && clearSec > 0) {
    result.push(formatDistanceStrict(fakeStartDate, sub(fakeStartDate, {
      seconds: clearSec
    }), {locale: ru, unit: 'second'}));
  }

  return result.join(' ');
};

export {formatISODate, countDuration};
