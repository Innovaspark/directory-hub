import mapboxgl from 'mapbox-gl';

// @ts-ignore
import workerUrl from 'mapbox-gl/dist/mapbox-gl-csp-worker.js?url';

// Handle both string and object cases
let resolvedWorkerUrl: string;

if (typeof workerUrl === 'string') {
  resolvedWorkerUrl = workerUrl;
} else if (workerUrl && workerUrl.default) {
  resolvedWorkerUrl = workerUrl.default;
} else {
  // Fallback to direct path
  resolvedWorkerUrl = '/mapbox-gl-csp-worker.js';
}

console.log('Final worker URL:', resolvedWorkerUrl);

(mapboxgl as any).workerClass = class {
  constructor() {
    return new Worker(resolvedWorkerUrl, { type: 'module' });
  }
};
