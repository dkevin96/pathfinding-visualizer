/**
 * PriorityQueue implemented as a min-heap data structure for pathfinding algorithms.
 *
 * Structure:
 * - Stores elements as [score, heuristic, pos] arrays where:
 *   - score: Total path cost to reach the node
 *   - heuristic: Manhattan distance to end point (tiebreaker)
 *   - pos: Position coordinates [row, col]
 *
 * Key Methods:
 * - Push(score, heuristic, pos): Adds new node and maintains heap property
 * - Pop(): Removes and returns lowest-scoring position
 * - Peek(): Returns lowest-scoring position without removing
 * - Length(): Returns queue size
 *
 * Ordering Priority:
 * 1. Lowest score (shortest path cost)
 * 2. If scores are equal, lowest heuristic (closest to goal)
 *
 * Used in pathfinding to ensure optimal nodes are processed first.
 */
class PriorityQueue {
  constructor() {
    this.arr = [];
  }

  /**
   * Adds a new node to the priority queue and maintains the min-heap property.
   *
   * @param {number} score - Total path cost to reach this node
   * @param {number} heuristic - Manhattan distance to end point (used as tiebreaker)
   * @param {Array<number>} pos - Position coordinates [row, col]
   *
   * Implementation:
   * 1. If queue is empty, simply add the new element
   * 2. Otherwise:
   *    - Add element to end of array
   *    - Heapify upwards from the new element to maintain min-heap property
   *    - Elements are ordered by:
   *      a) Lowest score first
   *      b) If scores are equal, lowest heuristic wins
   */
  Push(score, heuristic, pos) {
    if (this.arr.length === 0) {
      this.arr.push([score, heuristic, pos]);
    } else {
      this.arr.push([score, heuristic, pos]);
      this.HeapifyAll(this.arr.length - 1);
    }
  }

  /**
   * Removes and returns the lowest-scoring position from the priority queue.
   *
   * Implementation:
   * 1. Store the root node (lowest scoring element)
   * 2. Move the last element to the root position to avoid shifting the array
   * 3. Remove the last element
   * 4. Heapify downwards to maintain min-heap property
   * 5. Return the position of the original root node
   *
   * Return Value:
   * @returns {Array<number>} Position coordinates [row, col] of the lowest-scoring node
   *
   * Example:
   * - If heap contains [[1,2,[0,0]], [3,4,[1,1]]]
   * - Returns [0,0] (the position from the lowest scoring node)
   */
  Pop() {
    let tmp = this.arr[0];
    this.arr[0] = this.arr[this.arr.length - 1];
    this.arr[this.arr.length - 1] = tmp;
    this.arr.splice(this.arr.length - 1, 1);
    this.HeapifyAll(this.arr.length - 1);
    return tmp[2];
  }

  /**
   * Returns the position of the lowest-scoring node without removing it from the queue.
   * As we are using the min-heap, the lowest-scoring node is always at the root.
   */
  Peek() {
    return this.arr[0][2];
  }

  Length() {
    return this.arr.length;
  }

  /**
   * Maintains the min-heap property by comparing a node with its children and swapping if necessary.
   *
   * @param {number} index - The index of the node to heapify from
   *
   * Implementation:
   * 1. Find left child (2*index) and right child (2*index + 1)
   * 2. Compare parent with children using two criteria:
   *    a) Primary: Compare scores (arr[x][0])
   *    b) Secondary: If scores equal, compare heuristics (arr[x][1])
   * 3. If either child is smaller:
   *    - Swap parent with smallest child
   *    - Recursively heapify the affected subtree
   */
  Heapify(index) {
    let n = this.arr.length;
    let smallest = index;
    let left = 2 * index;
    let right = 2 * index + 1;

    if (left < n) {
      if (this.arr[smallest][0] > this.arr[left][0]) {
        smallest = left;
      } else if (this.arr[smallest][0] === this.arr[left][0]) {
        if (this.arr[smallest][1] > this.arr[left][1]) {
          smallest = left;
        }
      }
    }

    if (right < n) {
      if (this.arr[smallest][0] > this.arr[right][0]) {
        smallest = right;
      } else if (this.arr[smallest][0] === this.arr[right][0]) {
        if (this.arr[smallest][1] > this.arr[right][1]) {
          smallest = right;
        }
      }
    }

    if (smallest !== index) {
      let tmp = this.arr[index];
      this.arr[index] = this.arr[smallest];
      this.arr[smallest] = tmp;
      this.Heapify(smallest);
    }
  }

  /**
   * Performs bottom-up heapification of the entire heap structure.
   *
   * @param {number} index - The last index in the heap
   *
   * Implementation:
   * 1. Start from the parent of the last element (index/2)
   * 2. Move backwards towards root (index 0)
   * 3. Heapify each non-leaf node
   *
   * Example:
   * For array: [A, B, C, D, E, F, G]
   *                 A(0)
   *                /     \
   *             B(1)     C(2)
   *            /   \     /   \
   *          D(3)  E(4) F(5) G(6)
   * - Last index = 6
   * - Start from index 3 (parent of last element)
   * - Process: 3 -> 2 -> 1 -> 0
   *
   * Why bottom-up:
   * - More efficient as it ensures subtrees are already heapified
   * - Leaf nodes (nodes after index/2) don't need heapification since they have no children to compare against
   * - Builds a valid heap in O(n) time
   *
   * Formula: start: Math.floor(index / 2), left child: 2*index, right child: 2*index + 1
   */
  HeapifyAll(index) {
    for (let i = Math.floor(index / 2); i >= 0; i--) {
      this.Heapify(i);
    }
  }
}

export default PriorityQueue;
