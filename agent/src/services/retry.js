const tryWithRetry = (fn, atempt, atemptFailMsg = 'Atempt feil, left: {noAtempt}') => {
  return fn().catch((e) => {
    if (--atempt > 0) {
      console.log(atemptFailMsg.replace(/{noAtempt}/, atempt));
      return timeoutPromise(6000 / atempt).then(() => {
        return tryWithRetry(fn, atempt, atemptFailMsg);
      });
    } else {
      return Promise.reject(e);
    }
  });
};

const tryTillTheEnd = (fn, atemptFailMsg = 'Atempt feil') =>
  tryWithRetry(fn, 5, atemptFailMsg).catch(
      (e) => timeoutPromise(6000).then(
          () => periodicRetry(6000)(fn, atemptFailMsg)
      )
  );

const periodicRetry = (period) => (fn, atemptFailMsg) =>
  fn().catch((e) => {
    return timeoutPromise(period).then(() =>
      periodicRetry(period)(fn, atemptFailMsg)
    );
  });

const timeoutPromise = (delay) => new Promise(
    (resolve) => setTimeout(() => resolve(), delay)
);

exports.tryWithRetry = tryWithRetry;
exports.tryTillTheEnd = tryTillTheEnd;
exports.periodicRetry = periodicRetry;
