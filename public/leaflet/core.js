document.addEventListener('DOMContentLoaded', function () {
    try {
        L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';

        // Initialize map
        const map = L.map('map').setView([58.163576619299235, 8.003306530291821], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Debug the bunker data first
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

        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    } catch (error) {
        console.error('Map initialization error:', error);
    }
});