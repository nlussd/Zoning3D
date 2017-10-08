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
  "esri/geometry/geometryEngine",
  "esri/geometry/Point",


  "dojo/dom-construct",
  "dojo/dom",
  "dojo/on",
  "dojo/domReady!"
], function(Map, FeatureLayer, SceneView, SceneLayer, SimpleRenderer, UniqueValueRenderer, PointSymbol3D, SimpleFillSymbol, IconSymbol3DLayer, LabelSymbol3D, TextSymbol3DLayer, MeshSymbol3D,
  FillSymbol3DLayer, LineCallout3D, QueryTask, Query, StatisticDefinition, LayerList, Home, Legend, geometryEngine, Point, domConstruct, dom, on) {

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
      highlightOptions: {
          color: [0, 255, 255],
          fillOpacity: 0.6
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

    var legend = new Legend({
      view: view,
      container: "legend"
    });

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

    var template2 = {
      title: "contoh",
      content: "contoh"
    };

    var template = {
      title: "{ID_SUB_BLO}",
      content: "<img src='asset/building.png' height='50'>" + "<p><b>Info Zonasi</b></p>" +
      "<table>" +
      "<tr><td><b>Kecamatan</b></td><td>{KECAMATAN}</td></tr>" +
      "<tr><td><b>Kelurahan</b></td><td>{KELURAHAN}</td></tr>" +
      "<tr><td><b>ID Sub Blok</b></td><td>{ID_SUB_BLO}</td></tr>" +
      "<tr><td><b>Zona</b></td><td>{ZONA}</td></tr>" +
      "<tr><td><b>Sub Zona</b></td><td>{SUB_ZONA_D}</td></tr>" +
      "<tr><td><b>KDB</b></td><td>{KDB}</td></tr>" +
      "<tr><td><b>KLB</b></td><td>{KLB}</td></tr>" +
      "<tr><td><b>KB</b></td><td>{KB}</td></tr>" +
      "<tr><td><b>KDH</b></td><td>{KDH}</td></tr>" +
      "<tr><td><b>KTB</b></td><td>{KTB}</td></tr>" +
      "<tr><td><b>Tipe</b></td><td>{TIPE}</td></tr>" +
      "<tr><td><b>PSL</b></td><td>{PSL_1}</td></tr>" +
      "</table>",
      fieldInfos: [{
        fieldName: "KECAMATAN",
      },
      {
        fieldName: "KELURAHAN",
      },
      {
        fieldName: "ID_SUB_BLO",
      },
      {
        fieldName: "ZONA",
      },
      {
        fieldName: "SUB_ZONA_D",
      },
      {
        fieldName: "KDB",
      },
      {
        fieldName: "KLB",
      },
      {
        fieldName: "KB",
      },
      {
        fieldName: "KDH",
      },
      {
        fieldName: "TIPE",
      },
      {
        fieldName: "PSL_1",
      },
      {
        fieldName: "KTB",
      }
    ]
  };

  // Create SceneLayer and add to the map
  var sceneLayer = new SceneLayer({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Jakpus_bldg/SceneServer",
    popupEnabled: false,
    title: "Existing Building",
    visible: false
  });


  // create SceneLayer for zoning 3D and add to map
  var sceneLayer2 = new SceneLayer({
    url: "https://services8.arcgis.com/H0b9tuYGH1y9GBne/arcgis/rest/services/Zonasi_3D_Jakarta_Pusat/SceneServer/layers/0",
    popupEnabled: true,
    popupTemplate: template,
    title: "Zoning Building Envelope (3D)"
  });


  var zoning = new FeatureLayer({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Zoning_Pusat_2D/FeatureServer/0",
    elevationInfo: {
      mode: "absolute-height",
      offset: 0.3
    },
    popupEnabled: false,
    title: "Zoning Layer (2D)"
  });


  var krl = new FeatureLayer({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/KRL_Stasiun_Pusat/FeatureServer/0",
    elevationInfo: {
      mode: "relative-to-scene",
      offset: 20
    },
    popupEnabled: true,
    featureReduction: {
    type: "selection"
      },
    listMode: "hide",
    title: "KRL Station"
  });

  var halte = new FeatureLayer({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Halte_TJ_Pusat/FeatureServer/0",
    elevationInfo: {
      mode: "relative-to-scene",
      offset: 10
    },
    popupEnabled: true,
    featureReduction: {
    type: "selection"
      },
    listMode: "hide",
    title: "TransJakarta"
  });

  //add FeatureLayer and SceneLayer to map
  map.addMany([sceneLayer, sceneLayer2, zoning, krl, halte]);


  // Create query task for zoning Feature Service
  var queryZoningTask = new QueryTask({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Zoning_Pusat_2D/FeatureServer/0"
  });


  var queryArea = new Query();
  var statisticDefinitionArea = new StatisticDefinition();


  statisticDefinitionArea.statisticType = "sum";
  statisticDefinitionArea.onStatisticField = "POLY_AREA";
  statisticDefinitionArea.outStatisticFieldName = "CountArea";
  queryArea.where = "1=1";
  queryArea.outFields=["ZONA", "CountArea", "SUBZONA", "SUB_ZONA_D"];
  queryArea.groupByFieldsForStatistics = ["SUBZONA", "SUB_ZONA_D", "ZONA"];
  queryArea.outStatistics = [statisticDefinitionArea];


  queryZoningTask.execute(queryArea).then(function(result){

    console.log(result);

    //Crate variable for query result array untuk yang query area nich
    var labelArea = [];
    var dataArea = [];
    var zonaName = [];
    var subZonaName = [];

    //create loop for every result
    for (i = 0; i < result.features.length; i++) {
      console.log(result.features[i].attributes.CountArea);
      console.log(result.features[i].attributes.SUBZONA);
      console.log(result.features[i].attributes.ZONA);
      console.log(result.features[i].attributes.SUB_ZONA_D);

      //push result to variable array
      dataArea.push(result.features[i].attributes.CountArea);
      labelArea.push(result.features[i].attributes.SUBZONA);
      zonaName.push(result.features[i].attributes.ZONA);
      subZonaName.push(result.features[i].attributes.SUB_ZONA_D);
    }

    var pieData = [];
    // var colorData = ["#ff9932", "#0ef71e", "#702203", "#ef94c5","#67028e","#f7ef02","#f9f56d", "#f209cf","#4ff94f","#20a5e8"];


    for (i = 0; i < labelArea.length; i++){
      pieData.push({
        "Zone" : labelArea[i],
        "Area" : dataArea[i],
        // "Color": colorData[i]
      })
    }

    console.log(pieData);

    var alias = {};
    alias["CountArea"] = "Total Area (Ha)";
    alias["SUBZONA"] = "Sub Zona";

    var featureResult = ["<table border='1'><tr><td width='125'><b>Zona</b></td><td width='125'><b>Sub Zona</b></td><td width='50'><b>Kode Sub Zona</b></td><td width='100'><b>Luas Total(Ha)</b></td></tr></table>"];


    for (i = 0; i < labelArea.length; i++) {
      featureResult.push("<table border='1'><tr><td width='125'>"+ zonaName[i] + "   </td><td width='125'>"+ subZonaName[i] + "   </td><td width='50'>"+ labelArea[i] + "   </td><td width='100'>" + dataArea[i] + "   </td></tr></table>");
      $('.summDesc').html(featureResult);
    }


    var chart = AmCharts.makeChart("chartdiv2", {
      "type": "pie",
      "dataProvider": pieData,
      "valueField": "Area",
      "titleField": "Zone",
      // "colorField": "Color",
      "labelRadius": 6,
      "labelTickAlpha": 0.2,
      "fontSize" : 6,
      // "labelColorField": "color",
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


    for (i = 0;  i < result.features.length; i++) {
      buildingName.push(result.features[i].attributes.NAME);
      buildingId.push(result.features[i].attributes.OBJECTID);
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

    queryBuildingTask.execute(querySearch).then(function(result){

      //construct point for query geometry
      var queryPoint = new Point({
        longitude: result.features[0].geometry.longitude,
        latitude: result.features[0].geometry.latitude
      });

    var x = result.features[0].geometry.longitude;
    var y = result.features[0].geometry.latitude;

    view.goTo({
         position: {
           x: x,
           y: y,
           z: 700,
           spatialReference: {
              wkid: 4326
            }
         },
         heading: 0,
         tilt: 0
       }, {
         speedFactor: 0.3
       });


      // run query based on geometry
      var queryBuildingZone = new Query();
      queryBuildingZone.geometry = queryPoint;
      queryBuildingZone.spatialRelationship = "intersects";
      queryBuildingZone.outFields = ["*"];

      queryZoningTask.execute(queryBuildingZone).then(function(result) {
        console.log(result);

        var searchResultText = "Bangunan " + inputSearch + " berada di Kecamatan " + result.features["0"].attributes.KECAMATAN +
        ", Kelurahan " + result.features["0"].attributes.KELURAHAN + " dengan ID Sub Blok "
        + result.features["0"].attributes.ID_SUB_BLO + " Sub Blok " + result.features["0"].attributes.SUBBLOK
        + ". Area ini memiliki nilai Koefisien Dasar Bangunan(KDB) " + result.features["0"].attributes.KDB +
        ", Koefisien Lantai Bangunan (KLB) " + result.features["0"].attributes.KLB + ", dan Ketinggian Maksimum Bangunan "
        + result.features["0"].attributes.KB + " lantai.<br>"
        + "Lihat <a href='asset/itbx.pdf' target='_blank'>table ITBX</a>";

        // var searchResultTextCap = searchResultText.toUpperCase();
        //
        // console.log(searchResultTextCap);

        $('.searchDesc').html(searchResultText);


      });
    });
  }


  // Create MeshSymbol3D for symbolizing SceneLayer Building
  var symbol = new MeshSymbol3D(
    new FillSymbol3DLayer({
      // If the value of material is not assigned, the default color will be grey
      material: {
        // color: [211, 211, 111]
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
    field: "SUBZONA",
    defaultSymbol: new SimpleFillSymbol()
  });


  //Adding symbol for every unique value
  zoningRenderer.addUniqueValueInfo("R.10",
  new SimpleFillSymbol({
    color: "#F4F19A",
    outline: {
      color: "gray",
      outline: 0
    }
  })
);


zoningRenderer.addUniqueValueInfo("X.1",
new SimpleFillSymbol({
  color: "#D3FFBE",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("B.1",
new SimpleFillSymbol({
  color: "#00DAFE",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("C.1",
new SimpleFillSymbol({
  color: "#FAAA00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("C.2",
new SimpleFillSymbol({
  color: "#FAAA00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("C.3",
new SimpleFillSymbol({
  color: "#FAAA00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("C.4",
new SimpleFillSymbol({
  color: "#FAAA00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("L.1",
new SimpleFillSymbol({
  color: "#00734D",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("H.1",
new SimpleFillSymbol({
  color: "#4C7300",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("H.2",
new SimpleFillSymbol({
  color: "#55FF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("H.3",
new SimpleFillSymbol({
  color: "#AAFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("H.4",
new SimpleFillSymbol({
  color: "#44CC00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("H.5",
new SimpleFillSymbol({
  color: "#44CC00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("H.6",
new SimpleFillSymbol({
  color: "#44CC00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("H.7",
new SimpleFillSymbol({
  color: "#AAFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("G.1",
new SimpleFillSymbol({
  color: "#EBEBEB",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("G.2",
new SimpleFillSymbol({
  color: "#CCB4B4",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("I.1",
new SimpleFillSymbol({
  color: "#787878",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("I.2",
new SimpleFillSymbol({
  color: "#787878",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("I.3",
new SimpleFillSymbol({
  color: "#787878",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("I.4",
new SimpleFillSymbol({
  color: "#B2B2B2",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("I.5",
new SimpleFillSymbol({
  color: "#B2B2B2",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("I.6",
new SimpleFillSymbol({
  color: "#B2B2B2",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("K.1",
new SimpleFillSymbol({
  color: "#8400A8",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("K.2",
new SimpleFillSymbol({
  color: "#8400A8",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("K.3",
new SimpleFillSymbol({
  color: "#DF73FF",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("K.4",
new SimpleFillSymbol({
  color: "#DF73FF",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("P.1",
new SimpleFillSymbol({
  color: "#FF0000",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("P.2",
new SimpleFillSymbol({
  color: "#FF00C5",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("P.3",
new SimpleFillSymbol({
  color: "#FF7F7F",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("R.1",
new SimpleFillSymbol({
  color: "#FFFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("R.2",
new SimpleFillSymbol({
  color: "#FFFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("R.3",
new SimpleFillSymbol({
  color: "#FFFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("R.4",
new SimpleFillSymbol({
  color: "#FFFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("R.5",
new SimpleFillSymbol({
  color: "#FFFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("R.6",
new SimpleFillSymbol({
  color: "#FFFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("R.7",
new SimpleFillSymbol({
  color: "#FFFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("R.8",
new SimpleFillSymbol({
  color: "#FFFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("R.8",
new SimpleFillSymbol({
  color: "#FFFF00",
  outline: {
    color: "gray",
    outline: 0
  }
})
);


zoningRenderer.addUniqueValueInfo("R.9",
new SimpleFillSymbol({
  color: "#FFFFA0",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("S.1",
new SimpleFillSymbol({
  color: "#8A4545",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("S.2",
new SimpleFillSymbol({
  color: "#8A4545",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("S.3",
new SimpleFillSymbol({
  color: "#8A4545",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("S.4",
new SimpleFillSymbol({
  color: "#8A4545",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("S.5",
new SimpleFillSymbol({
  color: "#8A4545",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("S.6",
new SimpleFillSymbol({
  color: "#894444",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("S.7",
new SimpleFillSymbol({
  color: "#894444",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoningRenderer.addUniqueValueInfo("S.8",
new SimpleFillSymbol({
  color: "#8A4545",
  outline: {
    color: "gray",
    outline: 0
  }
})
);

zoning.renderer = zoningRenderer

// var symbolInfo = new PointSymbol3D({
//   symbolLayers: [new IconSymbol3DLayer({
//     size: 8,  // points
//     resource: { primitive: "circle" },
//     material: { color: "red" }
//   })]
// });

var symbolKrl = new PointSymbol3D({
  symbolLayers: [new IconSymbol3DLayer({
    resource: {
      href: "asset/station.png"
    },
    size: 12,
    outline: {
      color: "white",
      size: 1
    }
  })
],
verticalOffset: {
  screenLength: 10,
  maxWorldLength: 200,
  minWorldLength: 10
},
callout: new LineCallout3D({
  size: 0.5,
  color: "#f2f2f2"
})

// resource: {
//         primitive: "circle"
//       },
// material: {
//         color: "black"
//       },
// size: 4

});

var symbolHalte = new PointSymbol3D({
  symbolLayers: [new IconSymbol3DLayer({
    resource: {
      href: "asset/tj.png"
    },
    size: 10,
    outline: {
      color: "white",
      size: 1
    }
  })
],
verticalOffset: {
  screenLength: 10,
  maxWorldLength: 200,
  minWorldLength: 10
},
callout: new LineCallout3D({
  size: 0.5,
  color: "#f2f2f2"
})

// resource: {
//         primitive: "circle"
//       },
// material: {
//         color: "black"
//       },
// size: 4

});


krl.renderer = new SimpleRenderer({
  symbol : symbolKrl
});

halte.renderer = new SimpleRenderer({
  symbol : symbolHalte
});


});
