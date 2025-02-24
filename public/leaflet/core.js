document.addEventListener('DOMContentLoaded', function () {
    try {
       L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';
       
       // Initialize map
       const map = L.map('map').setView([58.163576619299235, 8.003306530291821], 13);
       
       // Add OpenStreetMap base layer
       const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
           maxZoom: 19
       }).addTo(map);
       
       // QGIS Cloud WMS URL
       const wmsUrl = 'https://wms.qgiscloud.com/LeneOlsen/is-218_oppgave_1_6_epsg3857/wms';
       
       // Define WMS layers using the exact layer names we discovered
       const wmsLayers = {
           "Oppgave1+2": L.tileLayer.wms(wmsUrl, {
               layers: 'Oppgave1+2',
               format: 'image/png',
               transparent: true,
               version: '1.3.0',
               uppercase: true,
               SERVICE: 'WMS'
           }),
           "ALTERNATIVT_TILFLUKTSSTED — shelter_type_agder": L.tileLayer.wms(wmsUrl, {
               layers: 'ALTERNATIVT_TILFLUKTSSTED — shelter_type_agder',
               format: 'image/png',
               transparent: true,
               version: '1.3.0',
               uppercase: true,
               SERVICE: 'WMS'
           }),
           "shelter_type_Agder": L.tileLayer.wms(wmsUrl, {
               layers: 'shelter_type_Agder',
               format: 'image/png',
               transparent: true,
               version: '1.3.0',
               uppercase: true,
               SERVICE: 'WMS'
           }),
           "Uia": L.tileLayer.wms(wmsUrl, {
               layers: 'Uia',
               format: 'image/png',
               transparent: true,
               version: '1.3.0',
               uppercase: true,
               SERVICE: 'WMS'
           }),
           "SamfunnssikkerhetTilfluktsromOffentlige": L.tileLayer.wms(wmsUrl, {
               layers: 'SamfunnssikkerhetTilfluktsromOffentlige',
               format: 'image/png',
               transparent: true,
               version: '1.3.0',
               uppercase: true,
               SERVICE: 'WMS'
           }),
           "BefolkningAgder": L.tileLayer.wms(wmsUrl, {
               layers: 'BefolkningAgder',
               format: 'image/png',
               transparent: true,
               version: '1.3.0',
               uppercase: true,
               SERVICE: 'WMS'
           }),
           "Vei til tilfluktsrom 2": L.tileLayer.wms(wmsUrl, {
               layers: 'Vei til tilfluktsrom 2',
               format: 'image/png',
               transparent: true,
               version: '1.3.0',
               uppercase: true,
               SERVICE: 'WMS'
           }),
           "Vei til tilfluktsrom 1": L.tileLayer.wms(wmsUrl, {
               layers: 'Vei til tilfluktsrom 1',
               format: 'image/png',
               transparent: true,
               version: '1.3.0',
               uppercase: true,
               SERVICE: 'WMS'
           }),
           "norge": L.tileLayer.wms(wmsUrl, {
               layers: 'norge',
               format: 'image/png',
               transparent: true,
               version: '1.3.0',
               uppercase: true,
               SERVICE: 'WMS'
           })
       };
       
       // Add the most relevant layer by default - this is likely what you want to see
       // You may want to change this to the layer that's most relevant for your application
       wmsLayers["SamfunnssikkerhetTilfluktsromOffentlige"].addTo(map);
       
       // Create the layer control with all available WMS layers
       const baseLayers = {
           "OpenStreetMap": osmLayer
       };
       
       // All layers are added to the control panel
       const overlays = wmsLayers;
       
       // Add layer control to the map
       L.control.layers(baseLayers, overlays).addTo(map);
       
       // Create legend helper to explain what's shown
       const legendDiv = document.createElement('div');
       legendDiv.className = 'legend';
       legendDiv.style = 'position: absolute; bottom: 30px; right: 10px; z-index: 1000; background: white; padding: 10px; border-radius: 5px; border: 1px solid #ccc;';
       legendDiv.innerHTML = `
           <h4>Layer Information</h4>
           <p><strong>Currently showing:</strong> <span id="active-layer">SamfunnssikkerhetTilfluktsromOffentlige</span></p>
           <p>Select different layers using the layer control in the top-right corner.</p>
           <div id="layer-info"></div>
       `;
       document.body.appendChild(legendDiv);
       
       // Update active layer info when layers are added/removed
       map.on('overlayadd', function(e) {
           document.getElementById('active-layer').textContent = e.name;
           updateLayerInfo(e.name);
       });
       
       // Function to update layer information
       function updateLayerInfo(layerName) {
           const infoDiv = document.getElementById('layer-info');
           
           // Layer-specific information
           const layerInfo = {
               "SamfunnssikkerhetTilfluktsromOffentlige": "Shows public shelters for civil protection",
               "shelter_type_Agder": "Shows shelter types in the Agder region",
               "Vei til tilfluktsrom 1": "Shows routes to shelter type 1",
               "Vei til tilfluktsrom 2": "Shows routes to shelter type 2",
               "BefolkningAgder": "Population data for Agder region",
               "ALTERNATIVT_TILFLUKTSSTED — shelter_type_agder": "Alternative shelter locations",
               "Oppgave1+2": "Assignment 1+2 data",
               "Uia": "University of Agder data",
               "norge": "Norway base map"
           };
           
           infoDiv.textContent = layerInfo[layerName] || "No description available for this layer";
       }
       
       // Set initial layer info
       updateLayerInfo("SamfunnssikkerhetTilfluktsromOffentlige");
       
       // Debug the bunker data
       console.log('Bunker Data Available:', !!window.bunkerData);
       if (window.bunkerData) {
           console.log('Number of bunkers:', window.bunkerData.length);
           console.log('Sample bunker coordinates:', window.bunkerData[0]?.geom?.coordinates);
       }
       
       // Add shelter points (blue markers - default)
       if (window.shelterData && window.shelterData.length > 0) {
           window.shelterData.forEach(point => {
               if (point.geom && point.geom.coordinates) {
                   const coordinates = point.geom.coordinates;
                   L.marker([coordinates[1], coordinates[0]])
                       .addTo(map)
                       .bindPopup('Shelter');
               }
           });
       }
       
       // Add bunker points (red markers)
       if (window.bunkerData && window.bunkerData.length > 0) {
           window.bunkerData.forEach((point, index) => {
               if (point.geom && point.geom.coordinates) {
                   // For first number: 6443876.506999999 should become 64.43876506999999
                   const lng = point.geom.coordinates[0] / 100000;
                   // For second number: 38562.688210000001 should become 8.562688210000001
                   const lat = point.geom.coordinates[1] / 100000;
                   console.log(`Adding bunker ${index} at:`, lat, lng);
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
                   }).addTo(map)
                       .bindPopup(`
                       <b>Public Bunker</b><br>
                       Address: ${point.adresse}<br>
                       Capacity: ${point.plasser} people<br>
                       Room Nr: ${point.romnr}
                       `);
               }
           });
       }
       
       // Add a debug panel with a button to adjust opacity
       const debugPanel = document.createElement('div');
       debugPanel.style = 'position: absolute; top: 10px; right: 10px; z-index: 1000; background: white; padding: 10px; border: 1px solid #ccc; border-radius: 5px;';
       debugPanel.innerHTML = `
           <h4>WMS Layer Controls</h4>
           <label for="opacity-slider">Layer Opacity: </label>
           <input type="range" id="opacity-slider" min="0" max="1" step="0.1" value="0.7">
           <div id="opacity-value">70%</div>
           <br>
           <button id="reload-wms">Reload WMS Layers</button>
       `;
       document.body.appendChild(debugPanel);
       
       // Add opacity slider functionality
       const opacitySlider = document.getElementById('opacity-slider');
       const opacityValue = document.getElementById('opacity-value');
       
       opacitySlider.addEventListener('input', function() {
           const opacity = parseFloat(this.value);
           opacityValue.textContent = Math.round(opacity * 100) + "%";
           
           // Update opacity for all WMS layers
           for (const layerName in wmsLayers) {
               wmsLayers[layerName].setOpacity(opacity);
           }
       });
       
       // Set initial opacity
       const initialOpacity = 0.7;
       opacitySlider.value = initialOpacity;
       opacityValue.textContent = Math.round(initialOpacity * 100) + "%";
       
       for (const layerName in wmsLayers) {
           wmsLayers[layerName].setOpacity(initialOpacity);
       }
       
       // Add reload button functionality
       document.getElementById('reload-wms').addEventListener('click', function() {
           // Get the currently visible layers
           const visibleLayers = [];
           
           for (const layerName in wmsLayers) {
               if (map.hasLayer(wmsLayers[layerName])) {
                   visibleLayers.push(layerName);
                   map.removeLayer(wmsLayers[layerName]);
               }
           }
           
           // Recreate the layers
           for (const layerName in wmsLayers) {
               wmsLayers[layerName] = L.tileLayer.wms(wmsUrl, {
                   layers: layerName,
                   format: 'image/png',
                   transparent: true,
                   version: '1.3.0',
                   uppercase: true,
                   SERVICE: 'WMS'
               });
           }
           
           // Re-add the visible layers
           for (const layerName of visibleLayers) {
               wmsLayers[layerName].addTo(map);
           }
           
           // Update the opacity
           const opacity = parseFloat(opacitySlider.value);
           for (const layerName in wmsLayers) {
               wmsLayers[layerName].setOpacity(opacity);
           }
       });
       
       setTimeout(() => {
           map.invalidateSize();
       }, 100);
       
    } catch (error) {
       console.error('Map initialization error:', error);
    }
   });