import { h } from "preact";
import style from "./style.module.css";
import {
  useRef,
  useEffect,
  useState,
  useMemo,
} from "preact/hooks";
import { setupLeafletMap } from "./setup-leaflet";
import * as L from "leaflet";
import { FeatureCollection, LineString } from "geojson";
import { TerraRouteGraph } from "../../../src/terra-route-graph";
import Header from "./header/Header";

const Home = () => {
  const lat = 51.536583;
  const lng = -0.07600000;
  const mapOptions = useMemo(() => ({
    L,
    id: "leaflet-map",
    lng,
    lat,
    zoom: 16,
    minZoom: 14,
    maxZoom: 19,
    tapTolerance: 10
  }), [lat, lng]);
  const ref = useRef(null);
  const [map, setMap] = useState<undefined | L.Map>();
  // const [mode, setMode] = useState<string>("static");
  const [network, setNetwork] = useState<FeatureCollection<LineString>>();

  const [info, setInfo] = useState({
    nodes: 0,
    edges: 0,
    connectedComponents: 0,
    longestEdge: 0,
    shortestEdge: 0,
    averageEdge: 0,
    degrees: { min: 0, max: 0, avg: 0 }
  })

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const path = isLocalhost ? '/public/network.json' : './network.json';

    fetch(path).then((res) => {
      res.json().then((network) => {
        setNetwork(network);
      });
    });
  }, []);

  useEffect(() => {
    if (map && network) {
      // Add a geojson layer to the map
      L.geoJSON(network, {
        style: {
          color: '#3b82f6',
          weight: 2,
          opacity: 0.8,
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name) {
            layer.bindTooltip(feature.properties.name, {
              permanent: true,
              direction: 'top',
              className: 'leaflet-tooltip',
            });
          }
        }
      }).addTo(map);

      const graph = new TerraRouteGraph(network)

      setInfo({
        nodes: graph.getNodeCount(),
        edges: graph.getEdgeCount(),
        connectedComponents: graph.getConnectedComponentCount(),
        longestEdge: graph.getLongestEdgeLength(),
        shortestEdge: graph.getShortestEdgeLength(),
        averageEdge: graph.getAverageEdgeLength(),
        degrees: graph.getNodeDegreeStats(),
      })

      const shortestEdge = graph.getShortestEdge();

      console.log('Shortest Edge:', shortestEdge);

      if (shortestEdge) {
        L.geoJSON(shortestEdge, {
          style: {
            color: '#f55f13',
            weight: 5,
            opacity: 1,
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindTooltip(feature.properties.name, {
                permanent: true,
                direction: 'top',
                className: 'leaflet-tooltip',
              });
            }
          }
        }).addTo(map);
      }

      const longestEdge = graph.getLongestEdge()

      if (longestEdge) {
        L.geoJSON(longestEdge, {
          style: {
            color: '#f55f13',
            weight: 5,
            opacity: 1,
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindTooltip(feature.properties.name, {
                permanent: true,
                direction: 'top',
                className: 'leaflet-tooltip',
              });
            }
          }
        }).addTo(map);
      }

    }
  }, [map, network]);

  useEffect(() => {
    if (!map) {
      setMap(setupLeafletMap(mapOptions));
    }
  }, [map, mapOptions]);


  return (
    <>
      <Header />

      <div class={style.home}>
        <div ref={ref} class={style.map} id={mapOptions.id}>
          <div class={style.info}>
            <div class={style.infoBox}>
              <h2 className={style.infoTitle}>Graph</h2>
              <p><strong>Connected Components</strong>: {info.connectedComponents}</p>
              <p><strong>Edges</strong>: {info.edges}</p>
              <p><strong>Nodes</strong>: {info.nodes}</p>
            </div>

            <div class={style.infoBox}>
              <h2 className={style.infoTitle}>Edge Length</h2>
              <p><strong>Longest edge (m)</strong>: {(info.longestEdge * 1000).toFixed(2)}</p>
              <p><strong>Shortest edge (m)</strong>: {(info.shortestEdge * 1000).toFixed(2)}</p>
              <p><strong>Average edge (m)</strong>: {(info.averageEdge * 1000).toFixed(2)}</p>
            </div>

            <div class={style.infoBox}>
              <h2 className={style.infoTitle}>Degrees</h2>
              <p><strong>Min</strong>: {info.degrees.min}</p>
              <p><strong>Max</strong>: {info.degrees.max}</p>
              <p><strong>Average</strong>: {info.degrees.avg.toFixed(2)}</p>
            </div>
          </div>
          {!network || !map ? <div class={style.loading}>Loading...</div> : null}
        </div>
      </div>
    </>
  );
};

export default Home;
