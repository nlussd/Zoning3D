  require('cedar', function(Cedar) {

    // Create bar type chart
    var chart = new Cedar({"type": "bar"});

    //create the dataset w/ mappings
  var dataset = {
    "url":"https://services2.arcgis.com/LvCBNZuwhTWWbvod/arcgis/rest/services/jakarta_sample_points/FeatureServer",
    "query": {
      "groupByFieldsForStatistics": "amenities",
      "outStatistics": [{
        "statisticType": "count",
        "onStatisticField": "amenities",
        "outStatisticFieldName": "CATEGORY_COUNT"
      }]
    },
    "mappings":{
      "sort": "amenities",
      "x": {"field":"amenities","label":"Category"},
      "y": {"field":"CATEGORY_COUNT","label":"Number of Category"}
    }
  };

  //assign to the chart
  chart.dataset = dataset;

  //show the chart
  chart.show({
    elementId: "#box"
  });



  });


