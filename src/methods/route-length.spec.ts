import { routeLength } from './route-length';
import { createLineStringFeature } from '../test-utils/create';
import { haversineDistance } from '../distance/haversine';
import type { Position } from 'geojson';

describe('routeLength', () => {
    it('returns 0 for a line with a single coordinate', () => {
        const line = createLineStringFeature([[0, 0]]);
        expect(routeLength(line)).toBeCloseTo(0, 12);
    });

    it('returns 0 when all coordinates are identical', () => {
        const a: Position = [0, 0];
        const line = createLineStringFeature([a, a, a]);
        expect(routeLength(line)).toBeCloseTo(0, 12);
    });

    it('computes distance for a single segment (Paris to London ~343.6 km)', () => {
        const paris: Position = [2.3522, 48.8566];
        const london: Position = [-0.1278, 51.5074];
        const line = createLineStringFeature([paris, london]);
        const distanceKm = routeLength(line);
        expect(distanceKm).toBeCloseTo(343.55, 1);
    });

    it('sums distances across multiple segments', () => {
        const p1: Position = [0, 0];
        const p2: Position = [0, 1];
        const p3: Position = [0, 2];
        const p4: Position = [1, 2];
        const line = createLineStringFeature([p1, p2, p3, p4]);

        const expected =
            haversineDistance(p1, p2) +
            haversineDistance(p2, p3) +
            haversineDistance(p3, p4);

        expect(routeLength(line)).toBeCloseTo(expected, 6);
    });

    it('is invariant under path reversal', () => {
        const coords: Position[] = [
            [0, 0],
            [0.3, 0.1],
            [0.6, 0.2],
            [1.0, 0.5],
        ];
        const line = createLineStringFeature(coords);
        const reversed = createLineStringFeature([...coords].reverse());

        expect(routeLength(line)).toBeCloseTo(routeLength(reversed), 12);
    });
});
