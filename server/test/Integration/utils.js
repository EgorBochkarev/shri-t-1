const retryTill = (fn) => new Promise((resolve, reject) => {
  const interval = setInterval(() => {
    fn(() => {
      clearInterval(interval);
      resolve();
    });
  }, 400);
});

module.exports = {
  retryTill
};
