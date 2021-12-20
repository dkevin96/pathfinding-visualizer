class Queue {
  constructor() {
      this.queue = [];
  }

  append(val) {
      this.queue.push(val);
  }

  popleft() {
      if (this.isEmpty()) return -1;
      return this.queue.shift();
  }

  isEmpty() {
      return this.queue.length === 0;
  }

  getLength() {
      return this.queue.length;
  }

  getArray() {
      return this.queue;
  }
}

export default Queue;