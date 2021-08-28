import DateRangePicker from './node_modules/vanillajs-datepicker/js/DateRangePicker.js';

const elem = document.getElementById('date-range');
const rangepicker = new DateRangePicker(elem, {
  format: 'yyyy-mm-dd'
}); 

document.getElementById("submit").addEventListener("click", getDataFromService);
var tableHeaderrs = ['S.No', 'Location', 'Magnitude'];
function getDataFromService() {
    var magnitude = document.getElementById('magnitude').value;
    var startDate = document.getElementById('start').value;
    var endDate = document.getElementById('end').value;
    const spinner = document.getElementById("spinner");
    spinner.className = "show";
    fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&minmagnitude=${magnitude}`).then(function (response) {
        spinner.className = spinner.className.replace("show", "");
        var b = document.getElementsByTagName('table')[0];
        if (b) {
            b.parentNode.removeChild(b);
        }
        return response.json();
    }).then(function (data) {
        var features = data.features;
        tableCreate(features);
    }).catch(function (err) {
        console.log('error', err);
    });
}

// To create a table
function tableCreate(features) {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var thead = document.createElement('thead');
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');
    if (tableHeaderrs && tableHeaderrs.length) {
        tableHeaderrs.forEach(headers => {
            var th = document.createElement('th');
            th.appendChild(document.createTextNode(headers));
            tr.appendChild(th);
        });
    }
    thead.appendChild(tr);
    if (features && features.length) {
        features.forEach((element, index) => {
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(index+1))
            tr.appendChild(td)
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(element.properties.place))
            tr.appendChild(td)
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(element.properties.mag))
            tr.appendChild(td)
            tbdy.appendChild(tr);
        });
    } else {
        var tr = document.createElement('tr');
        tr.appendChild(document.createTextNode('No Records available for this filter'));
        tbdy.appendChild(tr);
    }
    tbl.appendChild(thead);
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}
