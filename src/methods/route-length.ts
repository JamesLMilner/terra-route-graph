import { Feature, LineString } from "geojson";
import { haversineDistance } from "../distance/haversine";

/**
 * Calculates the total length of a LineString route in meters.
 *
 * @param line - A GeoJSON Feature<LineString> representing the route
 * @returns The total length of the route in meters
 */
export function routeLength(
    line: Feature<LineString>,
) {
    const lineCoords = line.geometry.coordinates;

    // Calculate the total route distance
    let routeDistance = 0;
    for (let i = 0; i < lineCoords.length - 1; i++) {
        routeDistance += haversineDistance(lineCoords[i], lineCoords[i + 1]);
    }
    return routeDistance
}
