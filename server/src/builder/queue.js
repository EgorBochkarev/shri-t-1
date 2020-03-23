const JSQueue = require('js-queue');

class Queue {
  static setToQueue(object) {
    return new Promise((resolve) => {
      const makeRequest = function makeRequest() {
        // eslint-disable-next-line no-invalid-this
        const jsQueue = this;
        resolve({
          object: object,
          next: () => {
            jsQueue.next();
          },
        });
      };
      Queue.queue.add(makeRequest);
    });
  }
}

Queue.queue = new JSQueue();

module.exports = Queue;
