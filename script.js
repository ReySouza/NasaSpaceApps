document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([-29.0000, 24.0000], 5);

    const streetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    });

    const satelliteMap = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        attribution: 'Tiles &copy; Google',
        maxZoom: 20
    });

    const baseMaps = {
        "Street Map": streetMap,
        "Satellite Map": satelliteMap
    };

    L.control.layers(baseMaps).addTo(map);
    streetMap.addTo(map);

    const kmlUrl = 'bioscape_domain_20220201.kml';
    const kmlLayer = omnivore.kml(kmlUrl, {
        style: function (feature) {
            return {
                fillColor: 'transparent',
                color: 'blue',
                weight: 2,
            };
        }
    });

    kmlLayer.addTo(map);

    kmlLayer.on('ready', function () {
        map.fitBounds(kmlLayer.getBounds());
    });

    kmlLayer.on('error', function (error) {
        console.error('Error loading KML layer:', error);
    });

    let activeImageIndex = -1; // Variable to track the active image overlay
    const imageUrls = [
        'image1.png',
        'image2.png',
        'image3.png',
        'image4.png',
        'image5.png',
        'image6.png',
        'image7.png',
        'image8.png',
        'image9.png',
    ];

    const imageBoundsArray = [
        [[-28.844, 14.618], [-34.142, 25.708]],  // Image 1 bounds
        [[-XX.XXX, XX.XXX], [-XX.XXX, XX.XXX]],  // Image 2 bounds
        [[-XX.XXX, XX.XXX], [-XX.XXX, XX.XXX]],  // Image 3 bounds
        [[-XX.XXX, XX.XXX], [-XX.XXX, XX.XXX]],  // Image 4 bounds
        [[-XX.XXX, XX.XXX], [-XX.XXX, XX.XXX]],  // Image 5 bounds
        [[-XX.XXX, XX.XXX], [-XX.XXX, XX.XXX]],  // Image 6 bounds
        [[-XX.XXX, XX.XXX], [-XX.XXX, XX.XXX]],  // Image 7 bounds
        [[-XX.XXX, XX.XXX], [-XX.XXX, XX.XXX]],  // Image 8 bounds
        [[-XX.XXX, XX.XXX], [-XX.XXX, XX.XXX]]   // Image 9 bounds
    ];

    function toggleImageOverlay(index) {
        if (activeImageIndex === index) {
            // If the same image is clicked again, remove it
            if (imageOverlays[index]) {
                map.removeLayer(imageOverlays[index]);
                imageOverlays[index] = null;
                activeImageIndex = -1;
            }
        } else {
            // Remove the active image overlay (if any)
            if (activeImageIndex !== -1 && imageOverlays[activeImageIndex]) {
                map.removeLayer(imageOverlays[activeImageIndex]);
                imageOverlays[activeImageIndex] = null;
            }

            // Add the clicked image overlay
            if (!imageOverlays[index]) {
                imageOverlays[index] = L.imageOverlay(imageUrls[index], imageBoundsArray[index]).addTo(map);
                activeImageIndex = index;
            }
        }
    }

    for (let i = 0; i < imageUrls.length; i++) {
        const button = L.Control.extend({
            options: {
                position: 'topleft'
            },

            onAdd: function () {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                container.innerHTML = `<button class="leaflet-control-button" data-index="${i}">Toggle Image ${i + 1}</button>`;
                L.DomEvent.disableClickPropagation(container);

                L.DomEvent.on(container, 'click', function (e) {
                    const index = e.target.getAttribute('data-index');
                    toggleImageOverlay(index);
                });

                return container;
            }
        });

        map.addControl(new button());
    }

    const imageOverlays = new Array(imageUrls.length);
});
