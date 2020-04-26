const tryWithRetry = <T>(fn: () => Promise<T>, atempt:number, atemptFailMsg = 'Atempt feil, left: {noAtempt}'):Promise<T> =>
  fn().catch((e) => {
    if (--atempt > 0) {
      console.log(atemptFailMsg.replace(/{noAtempt}/, String(atempt)));
      return timeoutPromise(6000 / atempt).then(() => {
        return tryWithRetry(fn, atempt, atemptFailMsg);
      });
    } else {
      return Promise.reject(e);
    }
  });

const tryTillTheEnd = <T>(fn: () => Promise<T>, atemptFailMsg = 'Atempt feil'):Promise<T> =>
  tryWithRetry(fn, 5, atemptFailMsg).catch(
      (e) => timeoutPromise(6000).then(
          () => periodicRetry(6000)(fn, atemptFailMsg)
      )
  );

const periodicRetry = (period:number) => <T>(fn: () => Promise<T>, atemptFailMsg:string):Promise<T> =>
  fn().catch(() => {
    return timeoutPromise(period).then(() =>
      periodicRetry(period)(fn, atemptFailMsg)
    );
  });

const timeoutPromise = (delay:number) => new Promise(
    (resolve) => setTimeout(() => resolve(), delay)
);

export {tryWithRetry, tryTillTheEnd, periodicRetry}
