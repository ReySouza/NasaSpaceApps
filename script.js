document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([-29.0000, 24.0000], 5);


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
    }); // Close the error handler function here

    const toggleButton = document.getElementById('toggleKML');
    let kmlLayerVisible = false;

    toggleButton.addEventListener('click', function () {
        if (kmlLayerVisible) {
            kmlLayer.setStyle({ opacity: 0, fillOpacity: 0 });
        } else {
            kmlLayer.setStyle({ opacity: 1, fillOpacity: 1 });
        }
        kmlLayerVisible = !kmlLayerVisible;
    });
});
