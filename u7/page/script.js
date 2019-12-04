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
var map = new Map({
    layers: layers,
    target: 'map',
    view: new View({
        projection: 'EPSG:4326',
        center: [17.89, 48.75],
        zoom: 16
    })
});
function vrstvy() {
    fetch('http://localhost:8080/geoserver/cviko/ows?service=wms&version=1.3.0&request=GetCapabilities').then(function (response) {
        return response.text();
    }).then(function (text) {
        var data = parser.read(text);
        console.log(data.Capability.Layer.Layer);
        console.log(data.Capability.Layer.Layer[0].Name);
        data.Capability.Layer.Layer.forEach(layer => {
            console.log(layer.Name, layer.queryable)
        });

        var table = "<tr><th>Vrstva</th><th>Dopyt</th><th>Checkbox</th></tr>";
        var dlzka = data.Capability.Layer.Layer.length;

        for (var r = 0; r <= dlzka - 1; r++) {
            const geoserverLayer = data.Capability.Layer.Layer[r];
            const layer = new ImageLayer({
                extent: [17.855810942987086, 48.74340686277337, 17.949233586756084, 48.791395668797165],
                source: new ImageWMS({
                    url: 'http://localhost:8080/geoserver/ows?',
                    params: { LAYERS: [geoserverLayer.Name] },
                    ratio: 1,
                    serverType: 'geoserver'
                }),
            })
            olLayers.push(layer)

            table += '<tr>';
            for (var c = 0; c <= 0; c++) {
                table += '<tr>' + '<td>' + geoserverLayer.Name + '</td>' + '<td>' + geoserverLayer.queryable + '</td>'
                    + '<td>' + `<input class="checkbox-class" id="checkbox-${r}"  type = "checkbox"/>` + '</td>' + '</tr>';
            }
            table += '</tr>';
        }
        document.body.insertAdjacentHTML('beforeend', '<table border = "1"> ' + table + '</table>')
    })
}
function pridatodobrat() {
    const checkboxes = document.getElementsByClassName("checkbox-class");
    const checboxArray = Array.from(checkboxes);
    checboxArray.forEach(function (checkbox) {
        const index = checkbox.id.split('-')[1];


        const layer = olLayers[index];
        if (checkbox.checked) {
            
            try {map.addLayer(layer)
                
            } catch (error) {
                console.log(error)
            }
        } else {
            map.removeLayer(layer)
        }
    })
}

