/**
 * Population Layer Module
 * Handles the display and styling of population data on the map
 */

/**
 * Creates a choropleth map based on population data
 * @param {Array} populationData - Array of population data objects from the database
 * @param {Object} layerGroup - Leaflet layer group to add the population layer to
 */
function addPopulationLayer(populationData, layerGroup) {
    if (!populationData || !populationData.length) {
        console.warn('No population data available');
        return;
    }

    console.log('Creating population layer with', populationData.length, 'regions');

    // Process each region
    populationData.forEach(region => {
        try {
            if (!region.geom) {
                console.warn('Region missing geometry data:', region.navnerom);
                return;
            }

            // Convert the geometry to GeoJSON format
            const geoJson = typeof region.geom === 'string'
                ? JSON.parse(region.geom)
                : region.geom;

            // Get population value
            const population = region.poptot || 0;

            // Create a polygon for the region
            const polygon = L.geoJSON(geoJson, {
                style: function () {
                    return {
                        fillColor: getColorByPopulation(population),
                        weight: 1,
                        opacity: 0.7,
                        color: '#666',
                        fillOpacity: 0.5
                    };
                }
            });

            // Add popup with region information
            polygon.bindPopup(`
                <strong>${decodeURIComponent(escape(region.navnerom || 'Område'))}</strong><br>
                Befolkning: ${population}<br>
                Område ID: ${decodeURIComponent(escape(region.lokalid || 'N/A'))}
            `);

            // Add to layer group
            polygon.addTo(layerGroup);

        } catch (error) {
            console.error('Error adding region to map:', error);
        }
    });

    // Add a legend to the map
    addLegend(layerGroup);
}

/**
 * Determines color based on population density
 * @param {number} population - Population count
 * @returns {string} - Hex color code
 */
function getColorByPopulation(population) {
    return population > 5000 ? '#800026' :
        population > 2000 ? '#BD0026' :
            population > 1000 ? '#E31A1C' :
                population > 500 ? '#FC4E2A' :
                    population > 200 ? '#FD8D3C' :
                        population > 100 ? '#FEB24C' :
                            population > 50 ? '#FED976' :
                                '#FFEDA0';
}

/**
 * Adds a legend to the map
 * @param {Object} layerGroup - Layer group to add the legend to
 */
function addLegend(layerGroup) {
    // This is a placeholder - in a real implementation, you would
    // create a custom control with a proper legend
    console.log('Legend would be added here in a real implementation');
}

export { addPopulationLayer };