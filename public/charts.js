if(document.getElementById("hobby") !== null){
  var hobby = document.getElementById("hobby");
  var hobbyId = hobby.getAttribute("data-hobby-id");
  var userId = hobby.getAttribute("data-user-id");
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);


  function drawChart() {
    var link = `http://localhost:3000/data/${userId}/${hobbyId}`
    var jsonData = $.ajax({
      url: link,
      dataType: "json",
      async: false
      }).responseText;


    // var keys = Object.keys(jsonData);
    var data = new google.visualization.DataTable(jsonData);
    
    // Set chart options
    var options = {'title':'Hobby data',
                  'width':400,
                  'height':300,
                    vAxis: {
                    title: 'Number of hrs spent on hobby'
                  },
                  hAxis: {
                    title: 'Day of week',
                  }
                  };
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      chart.draw(data, options);
  }
/***************************************************************************************************************************** */
}else if(document.getElementById("dashboard") !== null){
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);


  function drawChart() {
    var link = `http://localhost:3000/data/donutChart`
    var jsonData = $.ajax({
      url: link,
      dataType: "json",
      async: false
      }).responseText;

    // var keys = Object.keys(jsonData);
    var data = new google.visualization.DataTable(jsonData);
    
    // Set chart options
    var options = {'title':'Hobby Data',
                  'width':400,
                  'height':300,
                  'pieHole':0.5,
                    };
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
  }
}
