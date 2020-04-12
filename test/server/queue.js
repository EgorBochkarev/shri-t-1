const Queue = require('../../server/src/builder/queue');
const {it} = require('mocha');
const {expect} = require('chai');

it('Check queue', function(done) {
  // Prepare
  const objectsToPutInQueue = [{
    exectTime: 100
  }, {
    exectTime: 300
  }, {
    exectTime: 500
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
