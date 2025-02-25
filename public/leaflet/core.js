document.addEventListener('DOMContentLoaded', function () {
    try {
        // Sjekker om Proj4js er lastet - Proj4js library blir hentet i index.pug
        if (typeof proj4 === 'undefined') {
            console.error('Proj4js library not loaded! Please add the script tag in your HTML.');
            return;
        }

        // Definerer projeksjonen for Norge - UTM Sone 32N (EPSG:25832)
        proj4.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

        L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';
        const map = L.map('map').setView([58.163576619299235, 8.003306530291821], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Create layer groups to hold our markers
        const shelterLayer = L.layerGroup().addTo(map);
        const bunkerLayer = L.layerGroup().addTo(map);
        const positionLayer = L.layerGroup().addTo(map); // Layer for position marker
        const customLayer = L.layerGroup().addTo(map); // Layer for custom markers

        // Add shelter points (blue markers - default)
        if (window.shelterData && window.shelterData.length > 0) {
            window.shelterData.forEach(point => {
                if (point.geom && point.geom.coordinates) {
                    const coordinates = point.geom.coordinates;
                    L.marker([coordinates[1], coordinates[0]])
                        .addTo(shelterLayer)
                        .bindPopup('Shelter');
                }
            });
        }

        // Add bunker points (red markers)
        if (window.bunkerData && window.bunkerData.length > 0) {
            window.bunkerData.forEach((point, index) => {
                if (point.geom && point.geom.coordinates) {
                    try {
                        const utmEasting = point.geom.coordinates[0];
                        const utmNorthing = point.geom.coordinates[1];
                        // Konverterer fra UTM Sone 32N til WGS84
                        const wgs84Coords = proj4('EPSG:25832', 'WGS84', [utmEasting, utmNorthing]);
                        const lat = wgs84Coords[1];
                        const lng = wgs84Coords[0];

                        const marker = L.marker([lat, lng], {
                            icon: L.icon({
                                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                                shadowSize: [41, 41],
                                shadowAnchor: [12, 41]
                            })
                        }).addTo(bunkerLayer)
                            .bindPopup(`
                  <b>Public Bunker</b><br>
                  Address: ${point.adresse}<br>
                  Capacity: ${point.plasser} people<br>
                  Room Nr: ${point.romnr}
                `);
                    } catch (error) {
                        console.error(`Error converting coordinates for bunker ${index}:`, error);
                    }
                }
            });
        }

        // Add current position marker (green)
        let positionMarker = null;
        let customMarker = null;

        const greenIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 41]
        });

        const purpleIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 41]
        });

        // Helper function to calculate distance between two points in meters
        function calculateDistance(latlng1, latlng2) {
            return latlng1.distanceTo(latlng2);
        }

        // Function to find closest marker from a layer group
        function findClosestMarker(position, layerGroup) {
            let closestMarker = null;
            let closestDistance = Infinity;

            layerGroup.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    const distance = calculateDistance(position, layer.getLatLng());
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

        // Function to handle geolocation success
        function onLocationFound(e) {
            const radius = e.accuracy / 2;

            // Clear previous marker if exists
            if (positionMarker) {
                positionLayer.removeLayer(positionMarker);
            }

            // Add new position marker
            positionMarker = L.marker(e.latlng, {
                icon: greenIcon
            }).addTo(positionLayer);

            // Find closest shelter (blue marker)
            const closestShelter = findClosestMarker(e.latlng, shelterLayer);

            // Find closest bunker (red marker)
            const closestBunker = findClosestMarker(e.latlng, bunkerLayer);

            // Create information popup
            let popupContent = `<b>Din posisjon</b><br>Nøyaktighet: ${radius.toFixed(1)} meter<br><br>`;

            if (closestShelter.marker) {
                // Draw line to closest shelter
                const shelterLine = L.polyline([e.latlng, closestShelter.marker.getLatLng()], {
                    color: 'blue',
                    dashArray: '5, 10',
                    weight: 2
                }).addTo(positionLayer);

                popupContent += `<b>Nærmeste Shelter:</b> ${Math.round(closestShelter.distance)} meter<br>`;
            } else {
                popupContent += `<b>Ingen Shelters funnet</b><br>`;
            }

            if (closestBunker.marker) {
                // Draw line to closest bunker
                const bunkerLine = L.polyline([e.latlng, closestBunker.marker.getLatLng()], {
                    color: 'red',
                    dashArray: '5, 10',
                    weight: 2
                }).addTo(positionLayer);

                // Get the bunker details from the popup content
                let bunkerDetails = '';
                if (closestBunker.marker._popup) {
                    const popupElement = document.createElement('div');
                    popupElement.innerHTML = closestBunker.marker._popup._content;
                    bunkerDetails = popupElement.textContent.trim().replace(/\n\s+/g, ', ');
                }

                popupContent += `<b>Nærmeste Tilfluktsrom:</b> ${Math.round(closestBunker.distance)} meter`;
                if (bunkerDetails) {
                    popupContent += `<br><small>${bunkerDetails}</small>`;
                }
            } else {
                popupContent += `<b>Ingen Tilfluktsrom funnet</b>`;
            }

            positionMarker.bindPopup(popupContent).openPopup();

            // Add accuracy circle
            L.circle(e.latlng, {
                radius: radius,
                color: 'green',
                fillColor: '#3f9',
                fillOpacity: 0.2
            }).addTo(positionLayer);

            // Center map on position
            map.setView(e.latlng, map.getZoom());
        }

        // Function to handle geolocation errors
        function onLocationError(e) {
            alert("Kunne ikke finne din posisjon: " + e.message);
        }

        // Set up location tracking
        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);

        // Function to create custom marker and calculate distances
        function createCustomMarker(latlng) {
            // Clear previous custom marker if exists
            if (customMarker) {
                customLayer.removeLayer(customMarker);

                // Also clear all lines and distance indicators
                customLayer.eachLayer(layer => {
                    if (!(layer instanceof L.Marker)) {
                        customLayer.removeLayer(layer);
                    }
                });
            }

            // Add new custom marker
            customMarker = L.marker(latlng, {
                icon: purpleIcon,
                draggable: true // Make the marker draggable
            }).addTo(customLayer);

            // Find closest shelter (blue marker)
            const closestShelter = findClosestMarker(latlng, shelterLayer);

            // Find closest bunker (red marker)
            const closestBunker = findClosestMarker(latlng, bunkerLayer);

            // Create information popup
            let popupContent = `<b>Din valgte posisjon</b><br><br>`;

            if (closestShelter.marker) {
                // Draw line to closest shelter
                const shelterLine = L.polyline([latlng, closestShelter.marker.getLatLng()], {
                    color: 'blue',
                    dashArray: '5, 10',
                    weight: 2
                }).addTo(customLayer);

                popupContent += `<b>Nærmeste Shelter:</b> ${Math.round(closestShelter.distance)} meter<br>`;
            } else {
                popupContent += `<b>Ingen Shelters funnet</b><br>`;
            }

            if (closestBunker.marker) {
                // Draw line to closest bunker
                const bunkerLine = L.polyline([latlng, closestBunker.marker.getLatLng()], {
                    color: 'red',
                    dashArray: '5, 10',
                    weight: 2
                }).addTo(customLayer);

                // Get the bunker details from the popup content
                let bunkerDetails = '';
                if (closestBunker.marker._popup) {
                    const popupElement = document.createElement('div');
                    popupElement.innerHTML = closestBunker.marker._popup._content;
                    bunkerDetails = popupElement.textContent.trim().replace(/\n\s+/g, ', ');
                }

                popupContent += `<b>Nærmeste Tilfluktsrom:</b> ${Math.round(closestBunker.distance)} meter`;
                if (bunkerDetails) {
                    popupContent += `<br><small>${bunkerDetails}</small>`;
                }
            } else {
                popupContent += `<b>Ingen Tilfluktsrom funnet</b>`;
            }

            customMarker.bindPopup(popupContent).openPopup();

            // Update distances when marker is dragged
            customMarker.on('dragend', function (event) {
                const newPosition = event.target.getLatLng();
                createCustomMarker(newPosition);
            });
        }

        // Enable map click to place custom marker
        map.on('click', function (e) {
            createCustomMarker(e.latlng);
        });

        // Create a locate control button
        const locateControl = L.control({ position: 'bottomright' });

        locateControl.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'locate-control');
            div.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button id="locate-button" style="padding: 10px; background: white; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
              <span style="font-size: 16px;">📍 Finn min posisjon</span>
            </button>
            <button id="clear-custom-button" style="padding: 10px; background: white; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
              <span style="font-size: 16px;">🗑️ Fjern lilla markør</span>
            </button>
          </div>
        `;

            // Prevent map clicks from propagating through the control
            L.DomEvent.disableClickPropagation(div);

            return div;
        };

        locateControl.addTo(map);

        // Create custom control for layer selection
        const layerControl = L.control({ position: 'topright' });

        layerControl.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'layer-control');
            div.innerHTML = `
          <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);">
            <h4 style="margin: 0 0 5px 0;">Velg Shelters eller Tilfuktsrom for å se hvor de er</h4>
            <div>
              <label>
                <input type="checkbox" id="shelter-checkbox" checked>
                Shelters (Blå)
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" id="bunker-checkbox" checked>
                Tilfluktsrom (Rød)
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" id="position-checkbox" checked>
                Min posisjon (Grønn)
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" id="custom-checkbox" checked>
                Valgt posisjon (Lilla)
              </label>
            </div>
          </div>
        `;

            // Prevent map clicks from propagating through the control
            L.DomEvent.disableClickPropagation(div);

            return div;
        };

        layerControl.addTo(map);

        // Add event listeners to checkboxes
        setTimeout(() => {
            document.getElementById('shelter-checkbox').addEventListener('change', function (e) {
                if (e.target.checked) {
                    map.addLayer(shelterLayer);
                } else {
                    map.removeLayer(shelterLayer);
                }
            });

            document.getElementById('bunker-checkbox').addEventListener('change', function (e) {
                if (e.target.checked) {
                    map.addLayer(bunkerLayer);
                } else {
                    map.removeLayer(bunkerLayer);
                }
            });

            document.getElementById('position-checkbox').addEventListener('change', function (e) {
                if (e.target.checked) {
                    map.addLayer(positionLayer);
                } else {
                    map.removeLayer(positionLayer);
                }
            });

            document.getElementById('custom-checkbox').addEventListener('change', function (e) {
                if (e.target.checked) {
                    map.addLayer(customLayer);
                } else {
                    map.removeLayer(customLayer);
                }
            });

            // Add event listener for locate button
            document.getElementById('locate-button').addEventListener('click', function () {
                map.locate({
                    setView: true,
                    maxZoom: 16,
                    enableHighAccuracy: true
                });
            });

            // Add event listener for clear custom marker button
            document.getElementById('clear-custom-button').addEventListener('click', function () {
                if (customMarker) {
                    customLayer.clearLayers();
                    customMarker = null;
                }
            });
        }, 200);

        // Ensure map renders correctly
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

    } catch (error) {
        console.error('Map initialization error:', error);
    }
});