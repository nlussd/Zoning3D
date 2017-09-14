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
     
     

      "dojo/domReady!"
    ], function(Map, FeatureLayer, SceneView, SceneLayer, SimpleRenderer, UniqueValueRenderer, PointSymbol3D, SimpleFillSymbol, IconSymbol3DLayer, LabelSymbol3D, TextSymbol3DLayer, MeshSymbol3D,  
      FillSymbol3DLayer, LineCallout3D, QueryTask, Query, StatisticDefinition, LayerList, Home, Legend) {

      // Create Map
      var map = new Map({
        basemap: "gray-vector",
        ground: null,
      });


      // Create the SceneView
      var view = new SceneView({
        container: "viewDiv",
        map: map,
        center: [106.809205, -6.248750],
        camera: {
          position: [106.809205, -6.248750, 707],
          tilt: 81,
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
          "<p>KECAMATAN {Sheet1__ke}, KELURAHAN {Sheet1___1}. BLOK {Sheet1__ko}, SUB BLOK {Sheet1__Su}, SUB ZONA {Sheet1___2}. KDB {Sheet1__kd}, KLB {Sheet1__kl}, KB {Sheet1__kb}, KDH {Sheet1___3}, TIPE {Sheet1__ti}, PSL {Sheet1__ps}, KTB {Sheet1__kt}.</p>",
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
          fieldName: "Sheet1__kd",
        },
        {
          fieldName: "Sheet1__kl",
        },
        {
          fieldName: "Sheet1__kb",
        },
        {
          fieldName: "Sheet1___3",
        },
        {
          fieldName: "Sheet1__ti",
        },
        {
          fieldName: "Sheet1__ps",
        },
        {
          fieldName: "Sheet1__kt",
        }
        ]
      };

   // Create SceneLayer and add to the map
      var sceneLayer = new SceneLayer({
        url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/ArcGIS/rest/services/Kuningan_Building/SceneServer/layers/0",
        popupEnabled: false,
        title: "Existing Building",
        visible: false
      });


      // create SceneLayer for zoning 3D and add to map
      var sceneLayer2 = new SceneLayer({
        url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/ArcGIS/rest/services/Kuningan_Zoning_Ext/SceneServer/layers/1",
        popupEnabled: true,
        popupTemplate: template,
        title: "Zoning Building Envelope (3D)"
      });


      var zoning = new FeatureLayer({
        url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Kuningan_Zoning/FeatureServer/0",
        elevationInfo: {
          mode: "absolute-height",
          offset: 0.3
        },
        popupEnabled: false,
        title: "Zoning Layer (2D)"
      });



      //  var legend = new Legend({
      //       view: view,
      //       layerInfos: [{
      //         layer: zoning,
      //         title: "Zonasi"
      //       }]
      //     });

      // view.ui.add(legend, "top-right");


      // Create query task for zoning Feature Service
      var queryZoningTask = new QueryTask({
        url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Kuningan_Zoning/FeatureServer/0"  // URL of a feature layer representing Zoning
      });

      var query = new Query();
      var queryArea = new Query();
      var statisticDefinition = new StatisticDefinition();
      var statisticDefinitionArea = new StatisticDefinition();
    

        statisticDefinition.statisticType = "count";
        statisticDefinition.onStatisticField = "Sheet1__zona";
        statisticDefinition.outStatisticFieldName = "CountZona";
        query.where = "1=1";
        query.outFields=["Sheet1__zona", "CountZona"];
        query.groupByFieldsForStatistics = ["Sheet1__zona"];
        query.outStatistics = [statisticDefinition];


        statisticDefinitionArea.statisticType = "sum";
        statisticDefinitionArea.onStatisticField = "Sheet1__area";
        statisticDefinitionArea.outStatisticFieldName = "CountArea";
        queryArea.where = "1=1";
        queryArea.outFields=["Sheet1__zona", "CountArea"];
        queryArea.groupByFieldsForStatistics = ["Sheet1__zona"];
        queryArea.outStatistics = [statisticDefinitionArea];



        queryZoningTask.execute(query).then(function(result){

        console.log(result);
        
        //Crate variable for query result array
        var label = [];
        var data = [];

        //create loop for every result
        for (i = 0; i < result.features.length; i++) { 
         console.log(result.features[i].attributes.CountZona); 
         console.log(result.features[i].attributes.Sheet1__zona);

        //push result to variable array
        data.push(result.features[i].attributes.CountZona);
        label.push(result.features[i].attributes.Sheet1__zona);

        }

        console.log(label);

        // create data format for amcharts

        var serialData = [];

        for (a = 0; a < label.length; a++){
          serialData.push({
            "CZ" : label[a],
            "DZ" : data[a]
          })
        }

        console.log(serialData);

        // var chart = AmCharts.makeChart( "chartdiv", {
        //       "type": "serial",
        //       "theme": "light",
        //       "dataProvider": serialData,
        //       "valueAxes": [ {
        //         "gridColor": "#FFFFFF",
        //         "gridAlpha": 0.2,
        //         "dashLength": 0
        //       } ],
        //       "gridAboveGraphs": true,
        //       "startDuration": 1,
        //       "graphs": [ {
        //         "balloonText": "[[category]]: <b>[[value]]</b>",
        //         "fillAlphas": 0.8,
        //         "lineAlpha": 0.2,
        //         "type": "column",
        //         "valueField": "DZ"
        //       } ],
        //       "chartCursor": {
        //         "categoryBalloonEnabled": false,
        //         "cursorAlpha": 0,
        //         "zoomable": false
        //       },
        //       "categoryField": "CZ",
        //       "categoryAxis": {
        //         "autoRotateAngle": 57.6,
        //         "autoRotateCount": 0,
        //         "fontSize": 0,
        //         "gridPosition": "start",
        //         "gridAlpha": 0,
        //         "tickPosition": "start",
        //         "tickLength": 20
        //       },
        //       "export": {
        //         "enabled": false
        //       }

        //     } );
      

        });



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


        for (b = 0; b < labelArea.length; b++){
          pieData.push({
            "Zone" : labelArea[b],
            "Area" : dataArea[b]
          })
        }

        console.log(pieData);


        var pie = AmCharts.makeChart("chartdiv2",
        {
          "type": "pie",
          "balloonText": "[[title]]<br><span style='font-size:14px'>([[percents]]%)</span>",
          "titleField": "Zone",
          "valueField": "Area",
          "labelRadius": 1,
          "labelTickAlpha": 0,
          "fontSize": 0,
          "allLabels": [],
          "balloon": {},
          "legend": {
            "enabled": true,
            "switchType": "v",
            "align": "center",
            "bottom": 0,
            "fontSize": 7,
            "left": 6,
            "marginBottom": -3,
            "markerLabelGap": 4,
            "markerSize": 13,
            "position": "right",
            "tabIndex": -1,
            "valueText": ""
          },
          "titles": [],
          "dataProvider": pieData
        }
      );


        var chart = AmCharts.makeChart( "chartdiv", {
              "type": "serial",
              "theme": "light",
              "dataProvider": pieData,
              "valueAxes": [ {
                "gridColor": "#FFFFFF",
                "gridAlpha": 0.2,
                "dashLength": 0
              } ],
              // "titles": [
              //   {
              //     "id": "1",
              //     "size": 15,
              //     "text": "Zoning by Area"
              //   }
              // ],
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

            } );


        }); 


      //add FeatureLayer and SceneLayer to map
      map.addMany([sceneLayer, sceneLayer2, zoning]);

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


    });
