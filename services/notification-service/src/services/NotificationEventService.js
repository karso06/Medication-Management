const Subject = require("../observer/Subject");
const InAppNotificationObserver = require("../observer/InAppNotificationObserver");
const ConsoleNotificationObserver = require("../observer/ConsoleNotificationObserver");

class NotificationEventService {
  constructor() {
    this.subject = new Subject();
    this.subject.subscribe(new InAppNotificationObserver());
    this.subject.subscribe(new ConsoleNotificationObserver());
  }

  async processMedicationStatusChanged(eventPayload) {
    await this.subject.notify(eventPayload);
  }
}

module.exports = NotificationEventService;
