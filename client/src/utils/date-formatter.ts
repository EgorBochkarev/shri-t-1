import {format, formatDistanceStrict, sub} from 'date-fns';
import {ru, enGB as en} from 'date-fns/locale';

type Locale = 'en' | 'ru';
const locales = {ru, en}

const formatISODate = (timeISO?:string, locale:Locale = 'en') => {
  return timeISO && format(new Date(timeISO), 'd LLL HH:mm', {locale: locales[locale]})
};
const countDuration = (durationInMiliseconds?:string, locale:Locale = 'en') => {
  console.log('Locale', ru);
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
    }), {locale: locales[locale], unit: 'hour'}));
  }
  if (clearMins > 0) {
    result.push(formatDistanceStrict(fakeStartDate, sub(fakeStartDate, {
      minutes: clearMins
    }), {locale: locales[locale], unit: 'minute'}));
  }
  if (clearHours === 0 && clearSec > 0) {
    result.push(formatDistanceStrict(fakeStartDate, sub(fakeStartDate, {
      seconds: clearSec
    }), {locale: locales[locale], unit: 'second'}));
  }

  return result.join(' ');
};

export {formatISODate, countDuration};
