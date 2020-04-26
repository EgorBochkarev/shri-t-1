import JSQueue from 'js-queue';

class AgentQueue {
  static agentQueue = new JSQueue();
  static agentAddEvent:((id:string)=>void)[] = [];
  static async setAgentToQueue(id:string) {
    AgentQueue.agentQueue.stop = AgentQueue.agentQueue.contents.length === 0;
    AgentQueue.agentQueue.add(() => AgentQueue.emit(id));
    if (
      AgentQueue.agentQueue.contents.length === 1 &&
      AgentQueue.agentAddEvent.length > 0
    ) {
      AgentQueue.agentQueue.next();
    }
    AgentQueue.agentQueue.stop = false;
  }

  static async getAvailableAgent() {
    return new Promise<string>((resolve) => {
      AgentQueue.subscribe((id) => {
        resolve(id);
      });
      AgentQueue.agentQueue.next();
    });
  }

  static async subscribe(fn:(id:string)=>void) {
    AgentQueue.agentAddEvent.push(fn);
  }

  static async emit(id:string) {
    AgentQueue.agentAddEvent.forEach((fn) => fn(id));
    AgentQueue.agentAddEvent = [];
  }
}

export default AgentQueue;
