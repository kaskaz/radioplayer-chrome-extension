'use strict';

let audioSources = [
    {name:"Metal", url:"http://streaming.radionomy.com/Hard-HeavyMetalHits"},
    {name:"Morabeza", url:"http://radios.vpn.sapo.pt/CV/radio3.mp3"},
    {name:"Crioula FM", url:"http://radios.vpn.sapo.pt/CV/radio5.mp3"},
    {name:"Praia FM", url:"http://radios.vpn.sapo.pt/CV/radio4.mp3"},
    {name:"RCV", url:"http://radios.vpn.sapo.pt/CV/radio7.mp3"}
];

window.onload = function() {
    getList(function(result){
        result.stations.forEach( radio => addRow(radio) );
    });
};

function addRow(radio) {

    var list = getTable();
    var row = list.insertRow(-1);
    
    var colName = row.insertCell(0);
    var colEdit = row.insertCell(1);
    var colDele = row.insertCell(2);

    /**
     * Name label
     */
    colName.style.textAlign = 'left';
    colName.textContent = radio.name;
    
    /**
     * Edit button
     */
    var buttonEdit = document.createElement('button');
    buttonEdit.id = radio.id;
    buttonEdit.title = "Edit station's name or url";
    buttonEdit.stationName = radio.name;
    buttonEdit.stationUrl = radio.url;
    buttonEdit.onclick = editStation;

    var span = document.createElement('span');
    span.className = 'glyphicon glyphicon-pencil';

    buttonEdit.appendChild(span);
    colEdit.appendChild(buttonEdit);

    /**
     * Delete button
     */
    var buttonDelete = document.createElement('button');
    buttonDelete.id = radio.id;
    buttonDelete.onclick = removeStation;
    span = document.createElement('span');
    span.className = 'glyphicon glyphicon-trash';

    buttonDelete.appendChild(span);
    colDele.appendChild(buttonDelete);

};

/**
 * Add a station
 */
let form = document.getElementById('form-add');
form.onsubmit = function() {
    
    var name = document.getElementById('add-name');
    var url = document.getElementById('add-url');
    var id = generateId();

    getList( function(result){
        var list = result.stations;
        if(list === undefined) {
            list = [];
        }
        list.push({
            'id' : id,
            'name' : name.value,
            'url' : url.value
        });
        saveList(list);
    });

};

/**
 * Remove a station
 */
function removeStation(e) {
    var id = e.currentTarget.id;
    getList(function(result){
        var list = result.stations;
        var index = list.findIndex(function(station) { 
            return station.id == id; 
        });
        list.splice(index,1);
        saveList(list);
        window.location.reload();
    });
}

/**
 * Edit a station
 */
function editStation(e) {

    var buttonEdit = e.currentTarget;
    var currIndex = buttonEdit.parentNode.parentNode.rowIndex;

    /**
     * Close the current form
     * Adjust the next index if is not a cancel operation
     */
    var oldForm = document.getElementById('form-edit');
    if(oldForm != undefined ) {
        var lastIndex = oldForm.rowIndex;
        getTable().deleteRow(lastIndex);
        if(lastIndex == currIndex+1) {
            return;
        }
        if(lastIndex < currIndex) {
            currIndex = currIndex-1;
        }
    }

    /**
     * Insert a new row
     */
    var row = getTable().insertRow(currIndex+1);
    row.id = 'form-edit';
    
    var colName = row.insertCell(0);
    var colUrl = row.insertCell(1);
    var colSave = row.insertCell(2);

    colName.style.textAlign = 'left';
    var input = document.createElement('input');
    input.id = 'form-edit-name';
    input.value = buttonEdit.stationName;
    colName.appendChild(input);

    input = document.createElement('input');
    input.id = 'form-edit-url';
    input.value = buttonEdit.stationUrl;
    colUrl.appendChild(input);

    var button = document.createElement('button');
    button.id = buttonEdit.id;
    button.className = 'glyphicon glyphicon-ok-sign';
    colSave.appendChild(button);
    button.onclick = completeEdition;
     
}

/**
 * Completes the station edition
 */
function completeEdition(e) {
    
    var id = e.currentTarget.id;
    var name = document.getElementById('form-edit-name');
    var url = document.getElementById('form-edit-url');

    getList(function(result){
        var list = result.stations;
        var station = list.find(e => e.id == id);
        station.name = name.value;
        station.url = url.value;
        saveList(list);
    });

    // clears form
    var form = document.getElementById('form-edit');
    getTable().deleteRow(form.rowIndex);

    window.location.reload();
}

/**
 * Save list on storage
 */
function saveList(list) {
    chrome.storage.local.set({'stations': list}, function() {
        console.log('stations stored!');
    });
}

/**
 * Get list from storage
 */
function getList(callback) {
    chrome.storage.local.get(['stations'], callback);
}

/**
 * Generate Identifier
 */
function generateId() {
    return Math.trunc(Math.random()*100000);
}

/**
 * Get table body
 */
function getTable() {
    return document.getElementById('radio-list').getElementsByTagName('tbody')[0];
}