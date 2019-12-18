const Map = ol.Map;
const View = ol.View;
const ImageLayer = ol.layer.Image;
const TileLayer = ol.layer.Tile;
const ImageWMS = ol.source.ImageWMS;
const OSM = ol.source.OSM;
const WMSCapabilities = ol.format.WMSCapabilities;
var parser = new WMSCapabilities();
const olLayers = [];


var layers = [
    new TileLayer({
        source: new OSM()
    }),

];
var view = new View({
    projection: 'EPSG:4326',
    center: [17.886307, 48.743136],
    zoom: 13,
})
var map = new Map({
    layers: layers,
    target: 'map',
    view: view

});


function functionURL() {
    const x = document.getElementById("myURL").value;
    alert("Done !!!");
}

function visibility() {
    const url = document.getElementById("myURL").value;
    if (!url) {
        alert('No url')
        return;
    }
    fetch(url).then(function (response) {
        return response.text();
    }).then(function (text) {
        var data = parser.read(text);
        console.log(data.Capability.Layer.Layer);
        console.log(data.Capability.Layer.Layer[0].Name);
        data.Capability.Layer.Layer.forEach(layer => {
            console.log(layer.Name, layer.queryable)
        });

        var table = "<tr><th>Name</th><th>Queryable</th><th>Checkbox</th></tr>";
        var rows = data.Capability.Layer.Layer.length
        for (var r = 0; r <= rows - 1; r++) {
            const geoserverLayer = data.Capability.Layer.Layer[r];

            var wmsSource = new ImageWMS({
                url: 'http://localhost:8080/geoserver/cviko/wms',
                params: { LAYERS: [geoserverLayer.Name] },
                ratio: 1,
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
            })
            var layer = new ImageLayer({
                source: wmsSource,
                extent: [17.855810942987086, 48.74340686277337, 17.949233586756084, 48.791395668797165]
            })


            olLayers.push(layer)

            table += '<tr>';
            for (var c = 0; c <= 0; c++) {
                table += '<tr>' + '<td>' + geoserverLayer.Name + '</td>' + '<td>' + geoserverLayer.queryable + '</td>'
                    + '<td>' + `<input class="checkbox-class" center id="checkbox-${r}"  type = "checkbox"/>` + '</td>' + '</tr>';
            }
            table += '</tr>';
        }
        document.body.insertAdjacentHTML('beforeend', '<table border = "1"> ' + table + '</table>')
    })
    function showLayers() {
        const checkboxes = document.getElementsByClassName("checkbox-class");
        const checboxArray = Array.from(checkboxes);
        checboxArray.forEach(function (checkbox) {
            const index = checkbox.id.split('-')[1];
            const layer = olLayers[index];
            if (checkbox.checked) {

                try {
                    map.addLayer(layer)

                } catch (error) {
                    console.log(error)
                }
            } else {
                map.removeLayer(layer)
            }
        })
    }

}
function showLayers() {
    const checkboxes = document.getElementsByClassName("checkbox-class");
    const checboxArray = Array.from(checkboxes);
    checboxArray.forEach(function (checkbox) {
        const index = checkbox.id.split('-')[1];
        const layer = olLayers[index];
        if (checkbox.checked) {

            try {
                map.addLayer(layer)

            } catch (error) {
                console.log(error)
            }
        } else {
            map.removeLayer(layer)
        }
    })
}

map.on('singleclick', function (evt) {
    const sources = [];
    map.getLayers().forEach(layer => sources.push(layer.getSource()));
    document.getElementById('info').innerHTML = '';
    var viewResolution = view.getResolution();
    sources.forEach((wmsSource) => {
        var url = wmsSource.getFeatureInfoUrl && wmsSource.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326',
        { 'INFO_FORMAT': 'text/html' });
        if (url) {
            fetch(url)
            .then(function (response) { return response.text(); })
            .then(function (html) {
                    document.getElementById('info').insertAdjacentHTML( 'beforeend', html );
                });
        }

    })


});
map.on('pointermove', function (evt) {
    if (evt.dragging) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.forEachLayerAtPixel(pixel, function () {
        return true;
    });
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});