/**
 * Routing module
 * Handles OSRM route calculations and drawing routes on the map
 */

// Calculate route between two points using OSRM
function calculateRoute(startPoint, endPoint) {
    // OSRM public demo server
    const osrmURL = `https://router.project-osrm.org/route/v1/walking/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`;

    return fetch(osrmURL)
        .then(response => response.json())
        .then(data => {
            if (data.code !== 'Ok') {
                throw new Error(`OSRM returned an error: ${data.code}`);
            }
            return data.routes[0].geometry;
        });
}

// Draw route on the map
function drawRoute(geometry, color = '#3388ff', layerGroup) {
    const route = L.geoJSON(geometry, {
        style: {
            color: color,
            weight: 4,
            opacity: 0.6
        }
    }).addTo(layerGroup);

    return route;
}

export { calculateRoute, drawRoute };