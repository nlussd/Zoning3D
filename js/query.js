    require([
      "esri/tasks/QueryTask", 
      "esri/tasks/support/Query",
     
     

      "dojo/domReady!"
    ], function(QueryTask, Query) {

      var queryZoningTask = new QueryTask({
        url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Kuningan_Zoning/FeatureServer/0"  // URL of a feature layer representing Zoning
      });

      var query = new Query();
      query.where="1=1";
      query.outFields=["Sheet1__zona"];
      query.groupByFieldsForStatistics=["Sheet1__zona"];
      //query.orderByFields = ["Sheet1__kode_blok DESC"];
      query.outStatistics = [
          {
            "statisticType": "count",
            "onStatisticField": "Sheet1__zona",
            "outStatisticFieldName": "ZonaCount"
          }];
   

      queryZoningTask.execute(query).then(function(result){

      console.log(result);
        
        //Crate variable for query result array
        var label = [];
        var data = [];

        // //create loop for every result
        // for (i = 0; i < result.features.length; i++) { 
        //  console.log(result.features[i].attributes.Sheet1__zona);
        //  console.log(result.features[i].attributes.Sheet1__kode_blok);

        // //push result to variable array
        // label.push(result.features[i].attributes.Sheet1__zona);
        // data.push(result.features[i].attributes.Sheet1__kode_blok);
        // }

        // var ctx = document.getElementById("myChart").getContext('2d');
        // var myChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: {
        //       labels: label,
        //       datasets: [{
        //         data: data
        //       }]
        //     }
        // });

        });


      


    });
