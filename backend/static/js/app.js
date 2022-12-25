$(document).ready(function () {
  const ctx = document.getElementById("priceChart").getContext("2d");
  const ctxVolume = document.getElementById("volumeChart").getContext("2d");
  const ctxhistogram = document.getElementById("histogramChart").getContext("2d");

  const priceChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [{ label: "TSLA Price",  }],
    },
    options: {
      borderWidth: 3,
      borderColor: ['rgba(255, 99, 132, 1)',],
    },
  });

  const volumeChart = new Chart(ctxVolume, {
    type: "line",
    data: {
      datasets: [{ label: "TSLA Volume",  }],
    },
    options: {
      borderWidth: 3,
      borderColor: ['rgba(255, 199, 132, 1)',],
    },
  });

  const histogramChart = new Chart(ctxhistogram, {
    // type: 'histogram',
    // data: {
    //   datasets: [{ label: "TSLA Instogram",  }],
    // },
    // options: {
    //   borderWidth: 3,
    //   borderColor: ['rgba(155, 9, 132, 1)',],
    // },
    type: 'bar',
    data: {
      labels: [0, 1, 2, 3, 4],
      datasets: [{
        label: 'Number of Arrivals',
        data: [19, 28, 20, 16],
        backgroundColor: 'green',
      }]
    },
    options: {
      scales: {
        xAxes: [{
          display: false,
          barPercentage: 1.3,
          ticks: {
            max: 3,
          }
        }, {
          display: true,
          ticks: {
            autoSkip: false,
            max: 4,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  function addData(chartObject, label, data) {
    chartObject.data.labels.push(label);
    chartObject.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chartObject.update();
  }

  function removeFirstData(chartObject) {
    chartObject.data.labels.splice(0, 1);
    chartObject.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
  }

  const MAX_DATA_COUNT = 20;
  //connect to the socket server.
  //   var socket = io.connect("http://" + document.domain + ":" + location.port);
  var socket = io.connect();

  //receive details from server
  socket.on("updatePriceData", function (msg) {
    console.log("Received price :: " + msg.date + " :: " + msg.value);

    // Show only MAX_DATA_COUNT data
    if (priceChart.data.labels.length > MAX_DATA_COUNT) {
      removeFirstData(priceChart);
    }
    addData(priceChart, msg.date, msg.value);
  });

  
  //receive volume details from server
  socket.on("updateVolumeData", function (msg) {
    console.log("Received price :: " + msg.date + " :: " + msg.value);

    // Show only MAX_DATA_COUNT data
    if (volumeChart.data.labels.length > MAX_DATA_COUNT) {
      removeFirstData(volumeChart);
    }
    addData(volumeChart, msg.date, msg.value);
  });

  
  //receive histogram details from server
  socket.on("updateHistogramData", function (msg) {
    console.log("Received histogram :: " + msg.date + " :: " + msg.value);

   // Show only MAX_DATA_COUNT data
    if (histogramChart.data.labels.length > MAX_DATA_COUNT) {
      removeFirstData(histogramChart);
    }
    addData(histogramChart, msg.date, msg.value);
  });



  // var x = [];
  // for (var i = 0; i < 500; i ++) {
  //   x[i] = Math.random();
  // }

  // var trace = {
  //     x: x,
  //     type: 'histogram',
  //   };
  // var data = [trace];
  // console.log(data)
  // Plotly.newPlot('myDiv', data);

});
