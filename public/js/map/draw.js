/**
 * Simple polygon draw module
 * Implements Leaflet Draw functionality for creating polygons only
 */

// Initialize polygon drawing tool on the map
function initializePolygonDrawing(map, polygonLayer) {
    // Create draw control with polygon option only
    const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
            // Disable all other drawing tools
            polyline: false,
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            // Configure polygon tool
            polygon: {
                allowIntersection: false,
                drawError: {
                    color: '#e1e100',
                    message: '<strong>Error:</strong> Shape edges cannot cross!'
                },
                shapeOptions: {
                    color: '#3388ff',
                    weight: 3,
                    fillOpacity: 0.2
                }
            }
        },
        edit: {
            featureGroup: polygonLayer,
            remove: true
        }
    });

    // Add the draw control to the map
    map.addControl(drawControl);

    // Handle the create event
    map.on(L.Draw.Event.CREATED, function (event) {
        // Add the polygon to the layer
        const layer = event.layer;
        polygonLayer.addLayer(layer);
    });

    return drawControl;
}

// Clear all polygons
function clearPolygons(polygonLayer) {
    polygonLayer.clearLayers();
}

export {
    initializePolygonDrawing,
    clearPolygons
};