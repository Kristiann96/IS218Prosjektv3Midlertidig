/**
 * Drawing and Analysis module
 * Handles shape drawing and population/capacity analysis
 */

import { convertUTMToWGS84 } from './config.js';

// Initialize drawing controls
function initializeDrawing(map) {
    // Create a feature group to store drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Set up draw control options
    const drawControl = new L.Control.Draw({
        draw: {
            polyline: false,
            marker: false,
            circlemarker: false,
            polygon: {
                allowIntersection: false,
                showArea: true
            },
            rectangle: true,
            circle: true
        },
        edit: {
            featureGroup: drawnItems,
            remove: true
        }
    });

    map.addControl(drawControl);

    // Create population layer
    const populationLayer = L.layerGroup();
    
    // Load population data if available
    if (window.populationData && window.populationData.length) {
        loadPopulationData(window.populationData, populationLayer);
    }

    // Variable to store the current drawn shape
    let currentDrawnShape = null;

    // Event handler for when a shape is created
    map.on(L.Draw.Event.CREATED, function(event) {
        const layer = event.layer;
        
        // Remove previous shapes when a new one is drawn
        drawnItems.clearLayers();
        currentDrawnShape = layer;
        
        // Add the new layer
        drawnItems.addLayer(layer);
        
        // Perform analysis with the new shape
        if (window.populationData && window.bunkerData) {
            performAnalysis(layer, window.populationData, window.bunkerData, window.shelterData);
        }
    });

    // Event handler for when a shape is edited
    map.on(L.Draw.Event.EDITED, function(event) {
        const layers = event.layers;
        
        layers.eachLayer(function(layer) {
            currentDrawnShape = layer;
            
            // Perform analysis with the edited shape
            if (window.populationData && window.bunkerData) {
                performAnalysis(layer, window.populationData, window.bunkerData, window.shelterData);
            }
        });
    });

    // Event handler for when a shape is deleted
    map.on(L.Draw.Event.DELETED, function(event) {
        currentDrawnShape = null;
        clearAnalysisResults();
    });

    // Add event listener for clear analysis button
    document.getElementById('clear-analysis').addEventListener('click', function() {
        drawnItems.clearLayers();
        currentDrawnShape = null;
        clearAnalysisResults();
    });

    // Toggle population layer visibility based on checkbox
    document.getElementById('population-checkbox').addEventListener('change', function(e) {
        if (e.target.checked) {
            map.addLayer(populationLayer);
        } else {
            map.removeLayer(populationLayer);
        }
    });

    // Initially add the population layer if checkbox is checked
    if (document.getElementById('population-checkbox').checked) {
        map.addLayer(populationLayer);
    }

    return {
        drawnItems,
        populationLayer
    };
}

// Load and display population data on the map
function loadPopulationData(populationData, populationLayer) {
    populationData.forEach((area, index) => {
        try {
            if (area.geom && area.geom.coordinates) {
                // Parse the GeoJSON geometry
                const geoJsonArea = {
                    type: "Feature",
                    properties: {
                        poptot: area.poptot,
                        id: index
                    },
                    geometry: area.geom
                };

                // Add the area to the map with styling based on population
                L.geoJSON(geoJsonArea, {
                    style: function() {
                        // Color based on population density
                        const population = area.poptot || 0;
                        let fillColor = '#FFEDA0'; // Low density
                        
                        if (population > 2000) {
                            fillColor = '#BD0026'; // Very high density
                        } else if (population > 1000) {
                            fillColor = '#FC4E2A'; // High density
                        } else if (population > 500) {
                            fillColor = '#FD8D3C'; // Medium density
                        } else if (population > 100) {
                            fillColor = '#FEB24C'; // Low-medium density
                        }
                        
                        return {
                            fillColor: fillColor,
                            weight: 1,
                            opacity: 0.7,
                            color: '#666',
                            fillOpacity: 0.4
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(`
                            <strong>Befolkning:</strong> ${area.poptot} personer
                        `);
                    }
                }).addTo(populationLayer);
            }
        } catch (error) {
            console.error(`Error processing population area ${index}:`, error);
        }
    });
}

// Perform analysis with the drawn shape
function performAnalysis(drawnShape, populationData, bunkerData, shelterData) {
    // Get the bounds or center of the drawn shape depending on its type
    let shapeType, shapeBounds, shapeCenter, shapeRadius;
    
    if (drawnShape instanceof L.Circle) {
        shapeType = 'circle';
        shapeCenter = drawnShape.getLatLng();
        shapeRadius = drawnShape.getRadius();
        shapeBounds = drawnShape.getBounds();
    } else {
        // For polygons and rectangles
        shapeType = drawnShape instanceof L.Rectangle ? 'rectangle' : 'polygon';
        shapeBounds = drawnShape.getBounds();
    }
    
    // Calculate total population within the shape
    let totalPopulation = 0;
    populationData.forEach(area => {
        if (area.geom && area.geom.coordinates && area.poptot) {
            try {
                // Create a polygon from the population area GeoJSON
                const geoJsonArea = {
                    type: "Feature",
                    properties: {},
                    geometry: area.geom
                };
                
                const areaLayer = L.geoJSON(geoJsonArea);
                
                // Check if area intersects with the drawn shape
                let isIntersecting = false;
                
                if (shapeType === 'circle') {
                    // For circles, we need to check if the area intersects with the circle
                    areaLayer.eachLayer(layer => {
                        // Get all coordinates from the polygon
                        const polygonCoords = layer.feature.geometry.coordinates[0].map(
                            coord => L.latLng(coord[1], coord[0])
                        );
                        
                        // Check if any point is within the circle
                        for (const coord of polygonCoords) {
                            if (coord.distanceTo(shapeCenter) <= shapeRadius) {
                                isIntersecting = true;
                                break;
                            }
                        }
                    });
                } else {
                    // For rectangles and polygons, we can use the bounds to check intersection
                    const areaBounds = areaLayer.getBounds();
                    isIntersecting = areaBounds.intersects(shapeBounds);
                }
                
                if (isIntersecting) {
                    totalPopulation += area.poptot;
                }
            } catch (error) {
                console.error('Error analyzing population area:', error);
            }
        }
    });
    
    // Calculate total shelter capacity within the shape
    let totalShelterCapacity = 0;
    
    // Count bunker capacity
    bunkerData.forEach(bunker => {
        if (bunker.geom && bunker.geom.coordinates && bunker.plasser) {
            try {
                const utmEasting = bunker.geom.coordinates[0];
                const utmNorthing = bunker.geom.coordinates[1];
                
                // Convert coordinates
                const wgs84Coords = convertUTMToWGS84(utmEasting, utmNorthing);
                const lat = wgs84Coords[1];
                const lng = wgs84Coords[0];
                const bunkerLatLng = L.latLng(lat, lng);
                
                // Check if bunker is within the drawn shape
                let isInside = false;
                
                if (shapeType === 'circle') {
                    // For circles, check if bunker is within the radius
                    isInside = bunkerLatLng.distanceTo(shapeCenter) <= shapeRadius;
                } else if (shapeType === 'rectangle') {
                    // For rectangles, check if bunker is within bounds
                    isInside = shapeBounds.contains(bunkerLatLng);
                } else if (shapeType === 'polygon') {
                    // For polygons, check if bunker is within the polygon
                    // This is an approximation using bounds
                    isInside = shapeBounds.contains(bunkerLatLng);
                    // For more precise polygon containment, we would need a point-in-polygon algorithm
                }
                
                if (isInside) {
                    totalShelterCapacity += bunker.plasser;
                }
            } catch (error) {
                console.error('Error analyzing bunker:', error);
            }
        }
    });
    
    // Calculate coverage percentage
    const coveragePercentage = totalPopulation > 0 
        ? (totalShelterCapacity / totalPopulation) * 100 
        : 0;
    
    // Update the UI with analysis results
    updateAnalysisResults(totalPopulation, totalShelterCapacity, coveragePercentage);
}

// Update the UI with analysis results
function updateAnalysisResults(population, capacity, coverage) {
    document.getElementById('analysis-info').textContent = 'Analyseresultater for det valgte området:';
    document.getElementById('population-count').textContent = `${population.toLocaleString()} personer`;
    document.getElementById('shelter-capacity').textContent = `${capacity.toLocaleString()} plasser`;
    document.getElementById('coverage-percentage').textContent = `${coverage.toFixed(2)}%`;
    
    // Apply color based on coverage percentage
    const coverageElement = document.getElementById('coverage-percentage');
    if (coverage < 33) {
        coverageElement.style.color = '#d32f2f'; // Red for poor coverage
    } else if (coverage < 66) {
        coverageElement.style.color = '#f57c00'; // Orange for medium coverage
    } else {
        coverageElement.style.color = '#388e3c'; // Green for good coverage
    }
    
    // Show results container
    document.getElementById('analysis-results').style.display = 'block';
}

// Clear analysis results in the UI
function clearAnalysisResults() {
    document.getElementById('analysis-info').textContent = 'Tegn et område på kartet for å analysere befolkning og tilfluktsromkapasitet.';
    document.getElementById('analysis-results').style.display = 'none';
}

export { initializeDrawing };