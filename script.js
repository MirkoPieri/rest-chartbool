function init() {

  moment.locale('it');
  getElementAjax();

}

$(document).ready(init);

// chiamata ajax per dati e creazione grafico
function getElementAjax() {

  $.ajax({
    url: 'http://157.230.17.132:4008/sales',
    method: 'GET',

    success: function(data) {

      // richiamo della funzione per grafico lineare
      getLineGraph(data)

      // richiamo della funzione per grafico a torta
      getPieGraph(data);

    },
    error: function() {
      alert("Error to download data");
    }
  })

  $('.insert button').click(function() {
    insertNewAmount();
  })



}

// funzione per mesi in un array
function getMonth() {

  var monthList = moment.months();

  return monthList;
}

// funzione per ricavare dati da server e trasformarli per grafico
function getDataGraph(data) {
  var ammountSum = new Array(12).fill(0);

  var listaArray = data;

  for (var i = 0; i < data.length; i++) {
    var element = data[i];

    var monthMM = element.date;
    var ammountAA = Number(element.amount);

    var onlyMonth = moment(monthMM, 'DD.MM.YYYY').month();

    ammountSum[onlyMonth] += ammountAA;


}
  console.log(ammountSum, 'lol');
  return ammountSum;
}

// funzione per grafico lineare con vendite per ogni mese
function getLineGraph(data) {
  var elementi = getDataGraph(data);
  // creazione grafico a linea
  var ctx = document.getElementById('lineGraph');
  var myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels: getMonth(), //chiamo funzione che ritorna array dei mesi
        datasets: [{
          label: '% of Sales per Month',
          data: elementi, //chiamo funzione che ritorna un array con la somma delle vendite per ogni mese
          backgroundColor: [
              'gray',
              'purple',
              'red',
              'lightgreen',
              'yellow',
              'blue',
              'pink',
              'brown',
              'gray',
              'orange',
              'white',
              'lightpink',
          ],
          borderColor: [
              'lightgray'
          ],
          borderWidth: 3
        }]
      }
    });
};

// funzione per grafico a torta con venditori e percentuale
function getPieGraph(data) {

  var valori = data
  var sommaVendite = 0;
  var arrayNomi = [];
  var arrayVendite;
  var arrayPercentuale = [];
  for (var i = 0; i < data.length; i++) {

     var elemento = data[i];
     var elementoVendita = parseInt(elemento.amount);
     var nome = elemento.salesman;

     if (!arrayNomi.includes(nome)) {
       arrayNomi.push(nome);
     }

     sommaVendite += elementoVendita;

  }
  console.log(sommaVendite);
  arrayVendite = new Array(arrayNomi.length).fill(0);

  for (var j = 0; j < valori.length; j++) {
    var vendita = parseInt(valori[j].amount);
    var name = valori[j].salesman;

    for (var z = 0; z < arrayNomi.length; z++) {
      if (name === arrayNomi[z]) {
        arrayVendite[z] += vendita;
      } //chiusura if
    }
  } //chiusura for con indice j

  for (var x = 0; x < arrayVendite.length; x++) {
    var numero = ((arrayVendite[x] / sommaVendite) * 100);
    var arrotondato = numero.toFixed(1)
    arrayPercentuale.push(arrotondato);
  } //chiusura for arrayPercentuale

  var arrayNomePercentuale = [];
  // for pe aggiungere nome e percentuale nel grafico a torta
  for (var f = 0; f < arrayNomi.length; f++) {
    arrayNomePercentuale.push(arrayNomi[f] + " " + arrayPercentuale[f] + "%");
  }

  // grafico a torta
  var ctx = document.getElementById('pieGraph');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: arrayNomePercentuale, //array dei nomi dei venditori
      datasets: [{
        label: '% of Sales per Month',
        data: arrayPercentuale, //array con percentuale vendite per venditore
        backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(54, 162, 235)',
            'rgba(255, 206, 86)',
            'rgba(75, 192, 192)'
        ],
        borderWidth: 2
      }]
    }
  });
  console.log(arrayNomi);
}

// Funzione per aggiungere nuove vendite al grafico
function insertNewAmount() {

  var name = $(".insert select.name").val();
  var data = $(".insert select.data").val();
  var inputAmount = $(".insert input").val();
  var inputParse = parseInt(inputAmount);

  // condizione per verificare che tutti i campi siano inseriri
  if (name != 'name' && data != 'data' && inputAmount != "") {
    console.log(name);
    console.log(data);
    console.log(inputParse);

    // chiamata per aggiungere elementi
    $.ajax ({
      url: 'http://157.230.17.132:4008/sales',
      method: "POST",
      data: {
        'salesman': name,
        'amount': inputParse,
        'date': '01/' + data + '/2017'
      },
      success: function() {
        alert('Elemento Inserito Correttamente');
      },
      error: function() {
        alert("Error to Upload data");
      }
    })

  } else {
    alert("Controlla bene i campi da inserire");
  }

}
