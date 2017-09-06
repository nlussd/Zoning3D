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
      "esri/widgets/LayerList",
     
     

      "dojo/domReady!"
    ], function(Map, FeatureLayer, SceneView, SceneLayer, SimpleRenderer, UniqueValueRenderer, PointSymbol3D, SimpleFillSymbol, IconSymbol3DLayer, LabelSymbol3D, TextSymbol3DLayer, MeshSymbol3D,  
      FillSymbol3DLayer, LineCallout3D,QueryTask, Query, LayerList) {

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

     // console.log(popup);

        // autocasts as new PopupTemplate()
      var template = {
        title: "{Sheet1__zo}",
        content: "<p><b>Info Zonasi</b></p>" +
          "<p>KECAMATAN <b>{Sheet1__ke}</b>, KELURAHAN <b>{Sheet1___1}</b></p>"+
          "<p>BLOK <b>{Sheet1__ko}</b>, SUB BLOK <b>{Sheet1__Su}</b>, SUB ZONA <b>{Sheet1___2}</b></p>"+
          "<p><b>{Sheet1__zo}</b></p>"+
          "<p>KDB <b>{Sheet1__kd}</b>, KLB <b>{Sheet1__kl}</b>, KB <b>{Sheet1__kb}</b>, KDH <b>{Sheet1___3}</b>, TIPE <b>{Sheet1__ti}</b>, PSL <b>{Sheet1__ps}</b>, KTB <b>{Sheet1__kt}</b></p>",
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
        //popupTemplate: template
      });


      // create SceneLayer for zoning 3D and add to map
      var sceneLayer2 = new SceneLayer({
        url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/ArcGIS/rest/services/Kuningan_Zoning_Ext/SceneServer/layers/1",
        popupEnabled: true,
        popupTemplate: template
      });
      //console.log(sceneLayer2);

      var zoning = new FeatureLayer({
        url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Kuningan_Zoning/FeatureServer/0",
        elevationInfo: {
          mode: "absolute-height",
          offset: 0.3
        },
        popupEnabled: false
        //outFields: ["*"],
        //popupTemplate: template
      });
      //console.log(zoning);

      var queryZoningTask = new QueryTask({
        url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Kuningan_Zoning/FeatureServer/0"  // URL of a feature layer representing Zoning
      });

      var query = new Query();
      query.where="1=1";
      query.outFields=["Sheet1__kode_blok,Sheet1__zona "];
      query.orderByFields = ["Sheet1__kode_blok DESC"];


      queryZoningTask.execute(query).then(function(result){

        console.log(result);
        
        //Crate variable for query result array
        var label = [];
        var data = [];

        //create loop for every result
        for (i = 0; i < result.features.length; i++) { 
         console.log(result.features[i].attributes.Sheet1__zona);
         console.log(result.features[i].attributes.Sheet1__kode_blok);

        //push result to variable array
        label.push(result.features[i].attributes.Sheet1__zona);
        data.push(result.features[i].attributes.Sheet1__kode_blok);
        }

        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: label,
              datasets: [{
                data: data
              }]
            }
        });

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
