const JSQueue = require('js-queue');

class Queue {
  constructor() {
    this.queue = new JSQueue();
  }

  setToQueue(object) {
    return new Promise((resolve) => {
      const makeRequest = () => {
        resolve({
          object: object,
          next: () => {
            this.queue.next();
          },
        });
      };
      this.queue.add(makeRequest);
    });
  }
}

module.exports = Queue;
