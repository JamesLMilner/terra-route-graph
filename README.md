<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-dark-mode.png">
  <source media="(prefers-color-scheme: light)" srcset="./assets/logo.png">
  <img alt="Terra Draw logo" src="./assets/logo.png" width="400px">
</picture>

<p></p>

Terra Route Graph is a helper class to [Terra Route](https://www.github.com/JamesLMilner/terra-route) (a fast shortest path finding library). It provides functionality for better understanding your graphs that you use with Terra Route.

## Install

```
npm install terra-route-graph
```

## Docs 

[API Docs can be found here](https://jameslmilner.github.io/terra-route-graph/)

## 

TerraRouteGraph main use case is for for analyzing GeoJSON route networks. This class is especially useful for debugging, as it includes methods to identify unique nodes, edges, and connected components, along with their counts. Beyond debugging, these methods help you programmatically explore and understand the structure of your graph — for example, by measuring its size and examining how its parts are connected.

```typescript
const graph = new TerraDrawGraph(network);

// Return all nodes in the graph as FeatureCollection<Point>, where each unique node is a Feature<Point>
const graphPoints = graph.getNodes();

// Return all the unique edges as FeatureCollection<LineString>, where each unique edge is a Feature<LineString>
const graphEdges = graph.getEdges(); 
```
 
## License

MIT