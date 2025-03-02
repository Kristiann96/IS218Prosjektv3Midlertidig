// Initialize polygon drawing tool on the map
function initializePolygonDrawing(map, polygonLayer) {
    // Create draw control with polygon option only
    const drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
            // Disable all other drawing tools
            polyline: false,
            rectangle: false,
            circle: true,
            circlemarker: false,
            marker: false,
            polygon: false
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