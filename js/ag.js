require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/views/SceneView",
  "esri/layers/SceneLayer",
  "esri/renderers/SimpleRenderer",
  "esri/renderers/UniqueValueRenderer",
  "esri/symbols/PointSymbol3D",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/IconSymbol3DLayer",
  "esri/symbols/LabelSymbol3D",
  "esri/symbols/TextSymbol3DLayer",
  "esri/symbols/MeshSymbol3D",
  "esri/symbols/FillSymbol3DLayer",
  "esri/symbols/callouts/LineCallout3D",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/tasks/support/StatisticDefinition",
  "esri/widgets/LayerList",
  "esri/widgets/Home",
  "esri/widgets/Legend",


  "dojo/dom-construct",
  "dojo/dom",
  "dojo/on",
  "dojo/domReady!"
], function(Map, FeatureLayer, SceneView, SceneLayer, SimpleRenderer, UniqueValueRenderer, PointSymbol3D, SimpleFillSymbol, IconSymbol3DLayer, LabelSymbol3D, TextSymbol3DLayer, MeshSymbol3D,
  FillSymbol3DLayer, LineCallout3D, QueryTask, Query, StatisticDefinition, LayerList, Home, Legend, domConstruct, dom, on) {

    // Create Map
    var map = new Map({
      basemap: "gray-vector",
      ground: null,
    });


    // Create the SceneView
    var view = new SceneView({
      container: "viewDiv",
      map: map,
      center: [106.807595, -6.210656],
      camera: {
        position: [106.807595, -6.210656, 707],
        tilt: 70,
        heading: 50
      },
      environment: {
        lighting: {
          ambientOcclusionEnabled: true,
          directShadowsEnabled: true
        }
      },
      popup: {
        dockEnabled: true,
        dockOptions: {
          // Disables the dock button from the popup
          buttonEnabled: false,
          // Ignore the default sizes that trigger responsive docking
          breakpoint: false,
          //position of the dock pop-up
          position: "bottom-right"
        }
      }
    });

    popup = view.popup;

    var layerList = new LayerList({
      view: view
    });
    // Adds widget below other elements in the bottom left corner of the view
    view.ui.add(layerList, {
      position: "bottom-left"
    });

    // add home widget button
    var homeWidget = new Home({
      view: view
    });

    view.ui.add(homeWidget, "top-left");


    // autocasts as new PopupTemplate()
    var template = {
      title: "{Sheet1__zo}",
      content: "<p><b>Info Zonasi</b></p>" +
      "<p>KECAMATAN {Sheet1__ke}, KELURAHAN {Sheet1___1}. BLOK {Sheet1__ko}, SUB BLOK {Sheet1__Su}, SUB ZONA {Sheet1___2}. KDB {kdb}, KLB {klb}, KB {kb}, KDH {kdh}, TIPE {tipe}, PSL {psl}, KTB {ktb}.</p>",
      fieldInfos: [{
        fieldName: "Sheet1__ke",
      },
      {
        fieldName: "Sheet1___1",
      },
      {
        fieldName: "Sheet1__ko",
      },
      {
        fieldName: "Sheet1__Su",
      },
      {
        fieldName: "Sheet1___2",
      },
      {
        fieldName: "Sheet1__zo",
      },
      {
        fieldName: "kdb",
      },
      {
        fieldName: "klb",
      },
      {
        fieldName: "kb",
      },
      {
        fieldName: "kdh",
      },
      {
        fieldName: "tipe",
      },
      {
        fieldName: "psl",
      },
      {
        fieldName: "ktb",
      }
    ]
  };

  // Create SceneLayer and add to the map
  var sceneLayer = new SceneLayer({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/BHI/SceneServer",
    popupEnabled: false,
    title: "Existing Building",
    visible: false
  });


  // create SceneLayer for zoning 3D and add to map
  var sceneLayer2 = new SceneLayer({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Bundaran_HI_Zoning_3D/SceneServer/layers/1",
    popupEnabled: true,
    popupTemplate: template,
    title: "Zoning Building Envelope (3D)"
  });


  var zoning = new FeatureLayer({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Bundaran_HI_Zoning/FeatureServer/0",
    elevationInfo: {
      mode: "absolute-height",
      offset: 0.3
    },
    popupEnabled: false,
    title: "Zoning Layer (2D)"
  });

  var zoning = new FeatureLayer({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Bundaran_HI_Zoning/FeatureServer/0",
    elevationInfo: {
      mode: "absolute-height",
      offset: 0.3
    },
    popupEnabled: false,
    title: "Zoning Layer (2D)"
  });

  var info = new FeatureLayer({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Building_HI_SampleMain/FeatureServer/0",
    elevationInfo: {
      mode: "relative-to-ground",
      offset: 10
    },
    popupEnabled: false,
    listMode: "hide",
    title: "Contoh Info"
  });

  //add FeatureLayer and SceneLayer to map
  map.addMany([sceneLayer, sceneLayer2, zoning, info]);


  // Create query task for zoning Feature Service
  var queryZoningTask = new QueryTask({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Bundaran_HI_Zoning/FeatureServer/0"  // URL of a feature layer representing Zoning
  });


  var queryArea = new Query();
  var statisticDefinitionArea = new StatisticDefinition();


  statisticDefinitionArea.statisticType = "sum";
  statisticDefinitionArea.onStatisticField = "Sheet1__area";
  statisticDefinitionArea.outStatisticFieldName = "CountArea";
  queryArea.where = "1=1";
  queryArea.outFields=["Sheet1__zona", "CountArea"];
  queryArea.groupByFieldsForStatistics = ["Sheet1__zona"];
  queryArea.outStatistics = [statisticDefinitionArea];


  queryZoningTask.execute(queryArea).then(function(result){

    console.log(result);

    //Crate variable for query result array untuk yang query area nich
    var labelArea = [];
    var dataArea = [];

    //create loop for every result
    for (i = 0; i < result.features.length; i++) {
      console.log(result.features[i].attributes.CountArea);
      console.log(result.features[i].attributes.Sheet1__zona);

      //push result to variable array
      dataArea.push(result.features[i].attributes.CountArea);
      labelArea.push(result.features[i].attributes.Sheet1__zona);
    }

    var pieData = [];
    var colorData = ["#ff9932", "#0ef71e", "#702203", "#ef94c5","#67028e","#f7ef02","#f9f56d", "#f209cf","#4ff94f","#20a5e8"];
    var aliasZona = [];
    aliasZona["ZONA CAMPURAN"] = "CAMPURAN";
    aliasZona["ZONA JALUR HIJAU"] = "JALUR HIJAU";
    aliasZona["ZONA PELAYANAN UMUM DAN SOSIAL"] = "PELAYANAN UMUM DAN SOSIAL";
    aliasZona["ZONA PEMERINTAHAN DAERAH"] = "PEMERINTAHAN DAERAH";
    aliasZona["ZONA PEMERINTAHAN NASIONAL"] = "PEMERINTAHAN NASIONAL";
    aliasZona["ZONA PERKANTORAN, PERDAGANGAN, DAN JASA"] = "PERKANTORAN, PERDAGANGAN, DAN JASA";
    aliasZona["ZONA PERKANTORAN, PERDAGANGAN, DAN JASA KDB RENDAH"] = "PERKANTORAN, PERDAGANGAN, DAN JASA KDB RENDAH";
    aliasZona["ZONA PERUMAHAN KDB SEDANG-TINGGI"] = "PERUMAHAN KDB SEDANG-TINGGI";
    aliasZona["ZONA PERUMAHAN VERTIKAL"] = "PERUMAHAN VERTIKAL";
    aliasZona["ZONA PERWAKILAN NEGARA ASING"] = "PERWAKILAN NEGARA ASING";
    aliasZona["ZONA TAMAN KOTA/LINGKUNGAN"] = "TAMAN KOTA/LINGKUNGAN";
    aliasZona["ZONA TERBUKA BIRU"] = "TERBUKA BIRU";


    for (b = 0; b < labelArea.length; b++){
      pieData.push({
        "Zone" : aliasZona[labelArea[b]],
        "Area" : dataArea[b],
        "Color": colorData[b]
      })
    }

    console.log(pieData);

    var resultItems = [];

    var alias = {};
    alias["CountArea"] = "Total Area (m2)";
    alias["Sheet1__zona"] = "Zona";

    for (c = 0; c < result.features.length; c++) {
      var featureAttributes = result.features[c].attributes;
      for (var attr in featureAttributes) {
        resultItems.push("<b>" + alias[attr]+ ":</b>  " + featureAttributes[attr] + "<br>");
      }

      resultItems.push("<br>");
    }

    dom.byId("summaryTxt").innerHTML = resultItems.join("");

    var chart = AmCharts.makeChart("chartdiv2", {
      "type": "pie",
      "dataProvider": pieData,
      "valueField": "Area",
      "titleField": "Zone",
      "colorField": "Color",
      "labelRadius": 6,
      "labelTickAlpha": 0.2,
      "fontSize" : 6,
      "labelColorField": "color",
      "balloon": {
        "fixedPosition": true
      }
    });

    var chart = AmCharts.makeChart( "chartdiv", {
      "type": "serial",
      "theme": "light",
      "dataProvider": pieData,
      "valueAxes": [ {
        "gridColor": "#FFFFFF",
        "gridAlpha": 0.2,
        "dashLength": 0
      } ],
      "gridAboveGraphs": true,
      "startDuration": 1,
      "graphs": [ {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "fillAlphas": 0.8,
        "lineAlpha": 0.2,
        "type": "column",
        "valueField": "Area"
      } ],
      "chartCursor": {
        "categoryBalloonEnabled": false,
        "cursorAlpha": 0,
        "zoomable": false
      },
      "categoryField": "Zone",
      "categoryAxis": {
        "autoRotateAngle": 57.6,
        "autoRotateCount": 0,
        "fontSize": 0,
        "gridPosition": "start",
        "gridAlpha": 0,
        "tickPosition": "start",
        "tickLength": 20
      },
      "export": {
        "enabled": false
      }

    });
  });

  // contoh query untuk dapetin all building name
  var queryBuildingTask = new QueryTask({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Building_HI_SampleMain/FeatureServer/0"
  });

  var queryBuilding = new Query();

  queryBuilding.where = "1=1";
  queryBuilding.outFields = ["NAME", "OBJECTID"];

  queryBuildingTask.execute(queryBuilding).then(function(result){

    var buildingName = [];
    var buildingId = [];


    for (j = 0;  j < result.features.length; j++) {
      buildingName.push(result.features[j].attributes.NAME);
      buildingId.push(result.features[j].attributes.OBJECTID);
    }

    $("#search").autocomplete({
      source: buildingName
    });
  });

  $("#execute").click(executeQuery);

  function executeQuery(){
    var inputSearch = $("#search").val();
    var inputQuery = "NAME = '" + inputSearch + "'";

    var querySearch = new Query();
    querySearch.where = inputQuery;
    querySearch.returnGeometry = true;
    querySearch.outFields = ["NAME"];

    //ini geometry yang dihasilkan dari query nama building
    var geomSearch = [];

    queryBuildingTask.execute(querySearch).then(function(result){
      geomSearch.push(result.features["0"].geometry.longitude + "," + result.features["0"].geometry.latitude);

    console.log(geomSearch);
    // var queryBuildingZone = new Query();
    // // queryBuildingZone.where = "1=1";
    // queryBuildingZone.geometry = {106.82425878000004,-6.195507370999962};
    // // queryBuildingZone.geometryType = "esriGeometryPoint";
    // queryBuildingZone.returnGeometry = true;
    // queryBuildingZone.spatialRelationship = "intersects";
    // queryBuildingZone.outFields = ["*"];
    //
    // queryZoningTask.execute(queryBuildingZone).then(function(result) {
    //   console.log(result);
    // });

    });
  }





  // Create MeshSymbol3D for symbolizing SceneLayer Building
  var symbol = new MeshSymbol3D(
    new FillSymbol3DLayer({
      // If the value of material is not assigned, the default color will be grey
      material: {
        color: [244, 247, 134]
      }
    })
  );
  // Add the renderer to sceneLayer
  sceneLayer.renderer = new SimpleRenderer({
    symbol: symbol
  });

  // Create MeshSymbol3D for symbolizing SceneLayer Zoning 3D
  var symbol2 = new MeshSymbol3D(
    new FillSymbol3DLayer({
      // If the value of material is not assigned, the default color will be grey
      material: {
        //format for color is RGBa, a for opacity
        color: [255, 255, 255, 0.8]
      }
    })
  );
  // Add the renderer to sceneLayer
  sceneLayer2.renderer = new SimpleRenderer({
    symbol: symbol2
  });


  // Renderer for zoning 2D layer
  var zoningRenderer = new UniqueValueRenderer({
    field: "Sheet1__zona",
    defaultSymbol: new SimpleFillSymbol()
  });


  //Adding symbol for every unique value
  zoningRenderer.addUniqueValueInfo("ZONA CAMPURAN",
  new SimpleFillSymbol({
    color: [255, 153, 50],
    outline: {
      color: "gray",
      outline: 0
    }
  })
);

zoningRenderer.addUniqueValueInfo("ZONA JALUR HIJAU",
new SimpleFillSymbol({
  color: [14, 247, 30],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA PELAYANAN UMUM DAN SOSIAL",
new SimpleFillSymbol({
  color: [112, 34, 3],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA PEMERINTAHAN DAERAH",
new SimpleFillSymbol({
  color: [239, 148, 197],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA PEMERINTAHAN NASIONAL",
new SimpleFillSymbol({
  color: [249, 4, 17],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA PERKANTORAN, PERDAGANGAN, DAN JASA",
new SimpleFillSymbol({
  color: [103, 2, 142],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA PERKANTORAN, PERDAGANGAN, DAN JASA KDB RENDAH",
new SimpleFillSymbol({
  color: [217, 140, 247],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA PERUMAHAN KDB SEDANG-TINGGI",
new SimpleFillSymbol({
  color: [247, 239, 2],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA PERUMAHAN VERTIKAL",
new SimpleFillSymbol({
  color: [249, 245, 109],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA PERWAKILAN NEGARA ASING",
new SimpleFillSymbol({
  color: [242, 9, 207],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA TAMAN KOTA/LINGKUNGAN",
new SimpleFillSymbol({
  color: [79, 249, 79],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("ZONA TERBUKA BIRU",
new SimpleFillSymbol({
  color: [32, 165, 232],
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoning.renderer = zoningRenderer


var symbolInfo = new PointSymbol3D({
  symbolLayers: [new IconSymbol3DLayer({
    size: 8,  // points
    resource: { primitive: "circle" },
    material: { color: "red" }
  })]
});


info.renderer = new SimpleRenderer({
  symbol : symbolInfo
});


});
