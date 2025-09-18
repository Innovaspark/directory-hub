import mapboxgl from 'mapbox-gl';

// Plain JS require avoids TypeScript crying about ?url
// Vite will still handle the ?url at runtime
// @ts-ignore
import workerUrl from 'mapbox-gl/dist/mapbox-gl-csp-worker.js?url';

(mapboxgl as any).workerClass = class {
  constructor() {
    return new Worker(workerUrl, { type: 'module' });
  }
};
