const JSQueue = require('js-queue');

class AgentQueue {
  static async setAgentToQueue(id) {
    AgentQueue.agentQueue.stop = AgentQueue.agentQueue.contents.length === 0;
    AgentQueue.agentQueue.add(() => AgentQueue.emit(id));
    if (
      AgentQueue.agentQueue.contents.length === 1 &&
      AgentQueue.agentAddEvent > 0
    ) {
      AgentQueue.agentQueue.next();
    }
    AgentQueue.agentQueue.stop = false;
  }

  static async getAvailableAgent() {
    return new Promise((resolve) => {
      AgentQueue.subscribe((id) => {
        resolve(id);
      });
      AgentQueue.agentQueue.next();
    });
  }

  static async subscribe(fn) {
    AgentQueue.agentAddEvent.push(fn);
  }

  static async emit(id) {
    AgentQueue.agentAddEvent.forEach((fn) => fn(id));
    AgentQueue.agentAddEvent = [];
  }
}

AgentQueue.agentQueue = new JSQueue();
AgentQueue.agentAddEvent = [];

module.exports = AgentQueue;
