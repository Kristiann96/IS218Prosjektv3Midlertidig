/**
 * Main entry point for the map application
 * Imports and initializes all modules
 */
import { initializeProjection, initializeMap } from './map/config.js';
import { getIcons } from './map/icons.js';
import { createLayers, addShelters, addBunkers, addPopulationLayer, findClosestMarker } from './map/layers.js';
import { setupLocationTracking, setupCustomMarker } from './map/position.js';
import { createLocateControl, setupLayerControls } from './map/controls.js';
import { initializePolygonDrawing, clearPolygons } from './map/draw.js';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Initialize projection
        if (!initializeProjection()) {
            return;
        }
        // Initialize map
        const map = initializeMap();
        // Create layer groups
        const layers = createLayers(map);
        // Create a layer group for drawing polygons
        const polygonLayer = new L.FeatureGroup().addTo(map);
        layers.polygonLayer = polygonLayer;
        // Load icons
        const icons = await getIcons();
        // Add data points to map
        addShelters(window.shelterData, layers.shelterLayer, icons.shelterIcon);
        addBunkers(window.bunkerData, layers.bunkerLayer, icons.bunkerIcon);
        // Add population layer if data exists
        if (window.populationData && window.populationData.length > 0) {
            const populationLayer = addPopulationLayer(window.populationData, map);
            if (populationLayer) {
                layers.populationLayer = populationLayer;
            }
        } else {
            console.log('Population data is not available');
        }
        // Setup location tracking
        const locationTracker = setupLocationTracking(
            map,
            layers.positionLayer,
            layers.shelterLayer,
            layers.bunkerLayer,
            layers.routeLayer,
            icons
        );
        // Setup custom marker handling
        const customMarkerHandler = setupCustomMarker(
            map,
            layers.customLayer,
            layers.shelterLayer,
            layers.bunkerLayer,
            layers.routeLayer,
            icons
        );
        // Create UI controls
        createLocateControl(map, locationTracker, customMarkerHandler);
        // Setup layer control checkboxes
        setupLayerControls(map, layers);

        // Handle population layer visibility toggle - MOVED INSIDE THE DOM CONTENT LOADED HANDLER
        document.getElementById('population-checkbox').addEventListener('change', function () {
            if (this.checked) {
                if (layers.populationLayer) {
                    map.addLayer(layers.populationLayer);
                } else {
                    console.log('Population layer is not available');
                }
            } else {
                if (layers.populationLayer) {
                    map.removeLayer(layers.populationLayer);
                }
            }
        });

        // Initialize polygon drawing tools
        initializePolygonDrawing(map, polygonLayer);
        // Ensure map renders correctly
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Map initialization error:', error);
    }
});