describe('Modul tests', () => {
  require('./server/task-manager');
  require('./server/queue');
  require('./server/builder');
});
describe('Integration tests', () => {
  require('./Integration/configuration');
  require('./Integration/build');
});
