document.addEventListener('DOMContentLoaded', function() {
  // Lade die Objekte von der API
  fetch('https://api.npoint.io/47e0fcf21a87f4fba65a')
    .then(response => response.json())
    .then(data => {
      // Erzeuge das Dropdown-Menü für die Objekte
      var select = document.createElement('select');
      var defaultOption = document.createElement('option');
      defaultOption.text = 'Bitte wählen';
      select.add(defaultOption);
      
      data.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.value;
        option.text = item.name;
        select.add(option);
      });
      
      // Füge das Dropdown-Menü zur Seite hinzu
      var itemsDiv = document.getElementById('items');
      itemsDiv.appendChild(select);
      
      // Füge den Event-Listener für die Auswahl des Dropdown-Menüs hinzu
      select.addEventListener('change', function() {
        var selectedOption = select.options[select.selectedIndex];
        if (selectedOption.value !== '') {
          addSelectedObject(selectedOption.text, parseInt(selectedOption.value));
          berechne();
          // Setze das Dropdown-Menü zurück
          select.selectedIndex = 0;
        }
      });
    });
});

var selectedObjects = [];

function addSelectedObject(name, value) {
  // Prüfe, ob das Objekt bereits ausgewählt wurde
  var existingObjectIndex = selectedObjects.findIndex(obj => obj.name === name);
  if (existingObjectIndex !== -1) {
    // Wenn das Objekt bereits ausgewählt wurde, erhöhe die Menge
    selectedObjects[existingObjectIndex].quantity++;
  } else {
    // Wenn das Objekt zum ersten Mal ausgewählt wird, füge es mit einer Menge von 1 hinzu
    selectedObjects.push({name: name, value: value, quantity: 1});
  }
  updateSelectedObjectsList();
}

function removeSelectedObject(index) {
  selectedObjects.splice(index, 1);
  updateSelectedObjectsList();
  berechne();
}

function updateSelectedObjectsList() {
  var selectedObjectsList = document.getElementById('selected-objects');
  selectedObjectsList.innerHTML = '';
  selectedObjects.forEach(function(obj, index) {
    var listItem = document.createElement('li');
    var quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.value = obj.quantity;
    quantityInput.classList.add('quantity-input'); // Füge die Klasse hinzu
    quantityInput.addEventListener('input', function() {
      var newQuantity = parseInt(quantityInput.value);
      if (!isNaN(newQuantity) && newQuantity >= 1) {
        selectedObjects[index].quantity = newQuantity;
        berechne();
      }
    });
    listItem.appendChild(quantityInput);
    listItem.appendChild(document.createTextNode(obj.name));
    var removeButton = document.createElement('button');
    removeButton.innerText = 'X';
    removeButton.addEventListener('click', function() {
      removeSelectedObject(index);
    });
    listItem.appendChild(removeButton);
    selectedObjectsList.appendChild(listItem);
  });
}


function berechne() {
  var summe = 0;
  selectedObjects.forEach(function(obj) {
    summe += obj.value * obj.quantity; // Multipliziere den Wert mit der Menge
  });
  document.getElementById('ergebnis').innerText = 'Die Summe beträgt: ' + summe;
}