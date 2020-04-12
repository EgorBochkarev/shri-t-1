const Queue = require('../../server/src/builder/queue');
const {it} = require('mocha');
const {expect} = require('chai');

it('Check queue', function(done) {
  // Prepare
  const objectsToPutInQueue = [{
    exectTime: 10
  }, {
    exectTime: 30
  }, {
    exectTime: 50
  }];

  const resultOrder = [];
  Promise.all(objectsToPutInQueue.map((obj) => {
    return Queue.setToQueue(obj).then(({object, next}) => {
      resultOrder.push(object);
      setTimeout(next, object.exectTime);
      return object;
    });
  })).then((result) =>{
    expect(resultOrder).to.be.an('array').that.includes.members(result);
    done();
  }).catch((e) => {
    done(e);
  });
});
