/**
 * Controls module
 * Handles map controls and event listeners
 */

// Create locate control
function createLocateControl(map, locationTracker, customMarkerHandler) {
    const locateControl = L.control({ position: 'bottomright' });

    locateControl.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'locate-control');
        div.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button id="locate-button" style="padding: 10px; background: white; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; display: flex; align-items: center;">
              <img src="/assets/map-pin-svgrepo-com.svg" alt="Pin" style="width: 20px; height: 20px; margin-right: 8px; vertical-align: middle;">
              <span style="font-size: 16px; line-height: 20px;">Finn min posisjon</span>
            </button>
            <button id="clear-custom-button" style="padding: 10px; background: white; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; display: flex; align-items: center;">
              <img src="/assets/trash-svgrepo-com.svg" alt="Trash" style="width: 20px; height: 20px; margin-right: 8px; vertical-align: middle;">
              <span style="font-size: 16px; line-height: 20px;">Fjern lilla markør</span>
            </button>
          </div>
        `;

        // Prevent map clicks from propagating through the control
        L.DomEvent.disableClickPropagation(div);

        return div;
    };

    locateControl.addTo(map);

    // Add event listeners after DOM is fully loaded
    setTimeout(() => {
        // Locate button event listener
        document.getElementById('locate-button')?.addEventListener('click', function () {
            locationTracker.locateUser();
        });

        // Clear custom marker button event listener
        document.getElementById('clear-custom-button')?.addEventListener('click', function () {
            customMarkerHandler.clearCustomMarker();
        });
    }, 200);

    return locateControl;
}

// Set up layer control checkboxes
function setupLayerControls(map, layers) {
    const { shelterLayer, bunkerLayer, positionLayer, customLayer, routeLayer } = layers;

    setTimeout(() => {
        // Setup shelter layer control
        document.getElementById('shelter-checkbox')?.addEventListener('change', function (e) {
            if (e.target.checked) {
                map.addLayer(shelterLayer);
            } else {
                map.removeLayer(shelterLayer);
            }
        });

        // Setup bunker layer control
        document.getElementById('bunker-checkbox')?.addEventListener('change', function (e) {
            if (e.target.checked) {
                map.addLayer(bunkerLayer);
            } else {
                map.removeLayer(bunkerLayer);
            }
        });

        // Setup position layer control
        document.getElementById('position-checkbox')?.addEventListener('change', function (e) {
            if (e.target.checked) {
                map.addLayer(positionLayer);
            } else {
                map.removeLayer(positionLayer);
            }
        });

        // Setup custom marker layer control
        document.getElementById('custom-checkbox')?.addEventListener('change', function (e) {
            if (e.target.checked) {
                map.addLayer(customLayer);
            } else {
                map.removeLayer(customLayer);
            }
        });

        // Setup route layer control
        document.getElementById('route-checkbox')?.addEventListener('change', function (e) {
            if (e.target.checked) {
                map.addLayer(routeLayer);
            } else {
                map.removeLayer(routeLayer);
            }
        });
    }, 200);
}

export { createLocateControl, setupLayerControls };