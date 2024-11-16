# Finding The Shortest Path, With A Little Help From Dijkstra

![](https://miro.medium.com/v2/resize:fit:1200/1*49LYe8afsfWMxhagLTr9AQ.jpeg)

## Introduction and Graph Theory Basics

- The article "Finding The Shortest Path, With A Little Help From Dijkstra" by [[Vaidehi Joshi]] aims to explain Dijkstra's algorithm, a concept that can be intimidating for those without prior knowledge or context.
- The author had previously found Dijkstra's algorithm to be a difficult topic to understand but has since gained a deeper understanding of it and hopes to convey this understanding to readers.
- Before diving into Dijkstra's algorithm, the article reviews the basics of [[Graph theory | graph theory]], including the different types of graphs, such as directed and undirected graphs, and graph traversal algorithms like [[Breadth-first search | breadth-first search]] and depth-first search.
- The article introduces the concept of a weighted graph, which is a graph where each edge has a value or weight associated with it, representing the cost or distance between two nodes.
- The weight of an edge in a weighted graph can represent various things, such as the cost or distance between two locations, or the capacity of what can be transported between two nodes.
- Weighted graphs can be represented using an adjacency list, which is similar to the representation of unweighted graphs, but with an additional field to store the cost or weight of each edge.
- The author uses a map metaphor to explain the concept of weighted graphs, where the weight of an edge represents the distance or capacity between two locations.

## Weighted Graphs and Shortest Paths

- The article sets the stage for explaining Dijkstra's algorithm, which is used to find the shortest path in a weighted graph.
- The text discusses the representation of a weighted graph using an adjacency list, where each edge in the list contains two values: the opposite node's index and the weight associated with the edge.
- In an undirected graph, each edge appears twice in the adjacency list, once for each node it connects, and each instance includes the weight of the edge.
- Finding the shortest path between two nodes in a weighted graph is more complex than in an unweighted graph, as the weights of the edges must be taken into account.
- A simple example of a directed, weighted graph with three nodes (a, b, and c) illustrates that the shortest path between two nodes may not be the most direct route, but rather the route with the lowest total weight.
- In this example, the shortest path from node a to node b is not the direct edge with a weight of 5, but rather the route from node a to node c to node b, which has a total weight of 3 (2 + 1).
- As the size of the graph increases, finding the shortest path using a brute-force approach becomes less feasible and less efficient.

## Dijkstra's Algorithm Introduction

- Dijkstra's algorithm is introduced as a solution to this problem, which can find the shortest path from one node to every other node in a graph, provided that the nodes are reachable from the starting node.
- Dijkstra's algorithm is unique in that it can be used to find the shortest path from one node to all other nodes in a graph, not just between two specific nodes.
- Dijkstra's algorithm is a method for finding the shortest path between two nodes in a graph, and it can be run once to find the shortest paths between all reachable nodes, with the results stored for future reference.
- The algorithm only needs to be re-run if the graph data structure changes, ensuring that the shortest paths remain up-to-date.

## Dijkstra's Algorithm Setup and Rules

- To find the shortest path from node A to node E in a weighted, undirected graph, Dijkstra's algorithm requires initial setup and follows specific steps and rules.
- The rules for running Dijkstra's algorithm include choosing the node with the smallest known distance/cost to visit first, checking each neighboring node, calculating the distance/cost, and updating the shortest distance if necessary.
- The algorithm uses a table to keep track of the shortest known distance to every vertex and the previous vertex visited, with initial values set to infinity (∞) except for the starting node, which has a distance of 0.
- Two array structures, a visited array and an unvisited array, are used to keep track of which nodes have or haven't been visited.
- The algorithm starts with the starting node in the unvisited array and iteratively visits nodes, updating distances and previous vertices as necessary, until all reachable nodes have been visited.
- The steps and rules for running Dijkstra's algorithm can be abstracted and applied to every node in the graph, making it a flexible and efficient method for finding shortest paths.

## Dijkstra's Algorithm Application and Steps

- Dijkstra's algorithm is applied step-by-step to find the shortest path in a graph, following four rules: visiting the vertex with the smallest-known cost/distance, examining neighboring nodes, calculating distances, and updating the shortest distances if necessary.
- The algorithm starts by visiting node 'a', which has a distance of 0, and calculates the distances to its neighboring nodes 'b' and 'c', which are 7 and 3, respectively.
- The algorithm updates the shortest distances for nodes 'b' and 'c' to 7 and 3, respectively, and sets the previous vertex for both nodes to 'a'.
- The algorithm then visits node 'c', which has the smallest cost among unvisited nodes, and calculates the distances to its unvisited neighbors 'b' and 'd', which are 4 and 5, respectively.
- The algorithm updates the shortest distance for node 'd' to 5 and sets the previous vertex to 'c', and updates the shortest distance for node 'b' to 4 and sets the previous vertex to 'c', replacing the previous vertex 'a'.
- The algorithm then visits node 'b', which has the smallest cost among unvisited nodes, and calculates the distance to its unvisited neighbor 'e', which is 10, by summing the cost of 'b' (4) and the cost to get from 'b' to 'e' (6).
- Throughout the process, the algorithm keeps track of the shortest distances and previous vertices for each node, allowing it to find the shortest path from the starting vertex 'a' to all other nodes in the graph.
- Dijkstra's algorithm is used to find the shortest path in a graph by summing the shortest-known distance from the start to the current vertex and the cost from the current vertex to its neighbor.
- The algorithm continues to examine each unvisited vertex, updating the shortest-known distance and previous vertex values in the table as necessary.
- Once all vertices have been visited, the algorithm is complete, and the final table contains the shortest paths from the starting node to all other nodes.
- The shortest path to any node can be found by retracing the steps from that node back to the starting node, following the "previous vertex" values in the table.
- This is done by using a stack data structure, starting with the destination node and pushing each previous vertex onto the stack until the starting vertex is reached.
- The vertices are then popped off the stack in reverse order, revealing the shortest path from the starting node to the destination node.

## Dijkstra's Algorithm Efficiency and Reusability

- Dijkstra's algorithm can be run once and reused multiple times, as long as the graph remains unchanged, making it a powerful tool for finding shortest paths.
- The algorithm is a sophisticated take on breadth-first graph traversal, allowing it to efficiently find the shortest paths in a graph.
- Dijkstra's algorithm is a smarter and more efficient method for finding the shortest path in a graph, especially in weighted graphs, compared to other methods like [[Breadth-first search | Breadth-First Search]] (BFS).

## Real-World Applications and Complexity

- Although it functions similarly to BFS by spreading out wide rather than pursuing one specific path deeply, Dijkstra's algorithm is more intelligent and can handle complex problems like path-finding on a map.
- A common example of Dijkstra's algorithm in real-life applications is determining directions or finding a route on [[Google Maps]], but the implementation used in such applications is more complex and intelligent than a basic version of the algorithm.
- To find a path through Google Maps, the algorithm needs to consider additional factors like traffic, road conditions, road closures, and construction, making it a more complicated problem to solve.

## Dijkstra's Algorithm Origin and Significance

- [[Edsger W. Dijkstra]], the creator of the algorithm, initially struggled to find a simple example problem to illustrate the importance of finding the shortest path, but eventually used a transportation map of the [[Netherlands]] as an example.
- Dijkstra designed his algorithm in about 20 minutes while sitting in a café with his fiancée, and he credited the idea to a moment of inspiration while thinking about the problem of finding the shortest way to travel from [[Rotterdam]] to [[Groningen]].
- Dijkstra's algorithm is a well-known method of graph traversal in computer science, but it can be intimidating to understand due to its complexity and the many references to it.
- Fortunately, there are many resources available to help learn and understand Dijkstra's algorithm, and it is recommended to start with reliable sources to gain a deeper understanding of the topic.
