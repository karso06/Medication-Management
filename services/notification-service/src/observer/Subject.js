class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  async notify(eventPayload) {
    await Promise.all(
      this.observers.map((observer) => observer.update(eventPayload)),
    );
  }
}

module.exports = Subject;
