/**
 * Icons module
 * Handles all map icon definitions and icon loading checks
 */

// Define custom icons
function defineSVGIcons() {
    const bombShelterIcon = L.icon({
        iconUrl: window.location.origin + '/assets/bunker-svgrepo-com-3.svg',
        iconSize: [30, 30],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });

    const shelterIcon = L.icon({
        iconUrl: window.location.origin + '/assets/tent-7-svgrepo-com.svg',
        iconSize: [30, 30],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });

    return { bombShelterIcon, shelterIcon };
}

// Define fallback icons (standard Leaflet markers)
function defineFallbackIcons() {
    const fallbackShelterIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
    });

    const fallbackBunkerIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
    });

    return { fallbackShelterIcon, fallbackBunkerIcon };
}

// Define position marker icons
function definePositionIcons() {
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

    return { greenIcon, purpleIcon };
}

// Check if SVG icons can be loaded, use fallbacks if needed
function preloadImages(urls) {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const results = {};

        urls.forEach(url => {
            const img = new Image();
            img.onload = function () {
                results[url] = true;
                loadedCount++;
                if (loadedCount === urls.length) resolve(results);
            };
            img.onerror = function () {
                results[url] = false;
                loadedCount++;
                if (loadedCount === urls.length) resolve(results);
            };
            img.src = url;
        });
    });
}

// Get appropriate icons based on SVG loading status
async function getIcons() {
    const { bombShelterIcon, shelterIcon } = defineSVGIcons();
    const { fallbackShelterIcon, fallbackBunkerIcon } = defineFallbackIcons();
    const positionIcons = definePositionIcons();

    const shelterIconUrl = window.location.origin + '/assets/tent-7-svgrepo-com.svg';
    const bunkerIconUrl = window.location.origin + '/assets/bunker-svgrepo-com-3.svg';

    const results = await preloadImages([shelterIconUrl, bunkerIconUrl]);

    return {
        shelterIcon: results[shelterIconUrl] ? shelterIcon : fallbackShelterIcon,
        bunkerIcon: results[bunkerIconUrl] ? bombShelterIcon : fallbackBunkerIcon,
        greenIcon: positionIcons.greenIcon,
        purpleIcon: positionIcons.purpleIcon
    };
}

export { getIcons };