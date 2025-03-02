/**
 * Layers module
 * Handles creation and management of map layers
 */

import { convertUTMToWGS84 } from './config.js';

// Create all layer groups
function createLayers(map) {
    const shelterLayer = L.layerGroup().addTo(map);
    const bunkerLayer = L.layerGroup().addTo(map);
    const positionLayer = L.layerGroup().addTo(map);
    const customLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);
    const populationLayer = L.layerGroup().addTo(map);

    return {
        shelterLayer,
        bunkerLayer,
        positionLayer,
        customLayer,
        routeLayer,
        populationLayer
    };
}

// Add shelters to the map
function addShelters(shelterData, shelterLayer, icon) {
    if (!shelterData || !shelterData.length) return;

    shelterData.forEach(point => {
        if (point.geom && point.geom.coordinates) {
            const coordinates = point.geom.coordinates;
            L.marker([coordinates[1], coordinates[0]], { icon: icon })
                .addTo(shelterLayer)
                .bindPopup('Shelter');
        }
    });
}

// Add bunkers to the map
function addBunkers(bunkerData, bunkerLayer, icon) {
    if (!bunkerData || !bunkerData.length) return;

    bunkerData.forEach((point, index) => {
        if (point.geom && point.geom.coordinates) {
            try {
                const utmEasting = point.geom.coordinates[0];
                const utmNorthing = point.geom.coordinates[1];

                // Convert coordinates
                const wgs84Coords = convertUTMToWGS84(utmEasting, utmNorthing);
                const lat = wgs84Coords[1];
                const lng = wgs84Coords[0];

                L.marker([lat, lng], { icon: icon })
                    .addTo(bunkerLayer)
                    .bindPopup(`
                        <b>Offentlig tilfluktsrom</b><br>
                        Addresse: ${point.adresse}<br>
                        Kapasitet: ${point.plasser} people<br>
                        Romnr: ${point.romnr}
                    `);
            } catch (error) {
                console.error(`Error converting coordinates for bunker ${index}:`, error);
            }
        }
    });
}

// Find closest marker from a layer group
function findClosestMarker(position, layerGroup) {
    let closestMarker = null;
    let closestDistance = 50000;

    layerGroup.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            const distance = position.distanceTo(layer.getLatLng());
            if (distance < closestDistance) {
                closestDistance = distance;
                closestMarker = layer;
            }
        }
    });

    return {
        marker: closestMarker,
        distance: closestDistance
    };
}

// Add population data as a choropleth layer
function addPopulationLayer(populationData, map) {
    if (!populationData || !populationData.length) return null;

    // Create an object to hold GeoJSON data
    const geoJsonData = {
        type: 'FeatureCollection',
        features: []
    };

    // Convert population data to GeoJSON features
    populationData.forEach(region => {
        if (region.geom) {
            geoJsonData.features.push({
                type: 'Feature',
                geometry: region.geom,
                properties: {
                    name: region.grunnkretsnavn || 'Unknown',
                    population: region.antall_personer || 0
                }
            });
        }
    });

    // Create the choropleth layer with population styling
    const populationLayer = L.geoJSON(geoJsonData, {
        style: function (feature) {
            // Get color based on population count
            return {
                fillColor: getColorByPopulation(feature.properties.population),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function (feature, layer) {
            // Add popup with info
            layer.bindPopup(
                `<b>${feature.properties.name}</b><br>` +
                `Population: ${feature.properties.population}`
            );
        }
    });

    return populationLayer;
}

// Helper function to get color based on population count
function getColorByPopulation(population) {
    return population > 5000 ? '#800026' :
        population > 1000 ? '#E31A1C' :
            '#FEB24C';
}

export {
    createLayers,
    addShelters,
    addBunkers,
    findClosestMarker,
    addPopulationLayer
};