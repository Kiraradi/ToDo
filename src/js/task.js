import { Guid } from "js-guid";

export default class Task {
  constructor(name) {
    this.id = Guid.newGuid().StringGuid;
    this.name = name;
    this.status = false;
  }
}
