import JSQueue from 'js-queue';

interface QueueResult<T> {
  next():void,
  object:T
}


class Queue<T> {
  queue: JSQueue;
  constructor() {
    this.queue = new JSQueue();
  }

  setToQueue(object:T): Promise<QueueResult<T>> {
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

export default Queue;
