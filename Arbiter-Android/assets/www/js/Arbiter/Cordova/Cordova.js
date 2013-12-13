Arbiter.Cordova = (function() {
	var wktFormatter = new OpenLayers.Format.WKT();
	
	return {

		/**
		 * Save the current maps extent
		 */
		resetWebApp : function(tx) {
			var bbox = Arbiter.Map.getCurrentExtent().toBBOX();
            var zoom = Arbiter.Map.getZoom();
			var reset = function(){
				console.log("resetWebApp");
				cordova.exec(null, null, "ArbiterCordova",
						"resetWebApp", [bbox, zoom]);
			};
			
			Arbiter.SQLiteTransactionManager.executeAfterDone(reset);
		},
		
		setNewProjectsAOI: function(){
			var bbox = Arbiter.Map.getCurrentExtent().toBBOX(); 
			console.log("setNewProjectsAOI: bbox = " + bbox);
			cordova.exec(null, null, "ArbiterCordova",
					"setNewProjectsAOI", [bbox]);
		},
		
		doneCreatingProject: function(){
			cordova.exec(null, null, "ArbiterCordova",
					"doneCreatingProject", []);
		},
		
		errorCreatingProject: function(e){
			console.log("errorCreatingProject", e);
			cordova.exec(null, null, "ArbiterCordova",
					"errorCreatingProject", [e]);
		},
		
		errorLoadingFeatures: function(troublesomeFeatureTypes){
			var str = "";
			
			for(var i = 0; i < troublesomeFeatureTypes.length; i++){
				if(i > 0){
					str += troublesomeFeatureTypes[i];
				}else{
					str += ", " + troublesomeFeatureTypes[i];
				}
			}
			
			cordova.exec(null, null, "ArbiterCordova", "errorLoadingFeatures", [str]);
		},
		
		doneAddingLayers: function(){
			cordova.exec(null, null, "ArbiterCordova",
					"doneAddingLayers", []);
		},
		
		errorAddingLayers: function(e){
			cordova.exec(null, null, "ArbiterCordova", 
					"errorAddingLayers", [e]);
		},
		
		// TODO: Right the native method and then call here
		updateFeatureData : function(featureType, features) {
			// make call to plugin passing the featureType and features
		},
		
		displayFeatureDialog : function(featureType, id){
			console.log("displayFeatureDialog: featureType = " + 
					featureType + ", id = " + id);
			
			if(featureType === null || featureType === undefined
					|| id === undefined || id === null){
				return;
			}
			
			cordova.exec(null, null, "ArbiterCordova",
					"featureSelected", [featureType, id])
		},
		
		getUpdatedGeometry: function(){
			var selectedFeature = Arbiter.Controls.ControlPanel.getSelectedFeature();
			
			if(selectedFeature !== null && selectedFeature !== undefined){
				
				var schemas = Arbiter.getLayerSchemas();
				
				var schema = schemas[Arbiter.Util.getLayerId(selectedFeature.layer)];
				
				var srid = Arbiter.Map.getMap().projection.projCode;
				
				var updatedGeometry = wktFormatter.write(
						Arbiter.Util.getFeatureInNativeProjection(srid,
								schema.getSRID(), selectedFeature));
				
				Arbiter.Controls.ControlPanel.exitModifyMode();
				
				cordova.exec(null, null, "ArbiterCordova",
						"updatedGeometry", [updatedGeometry]);
			}
		},
		
		doneInsertingFeature: function(layerId, feature){
			if(feature === null || feature === undefined){
				throw "Arbiter.Cordova.doneInsertingFeature - "
					+ "feature should not be '" + feature + "'";
			}
			
			var schema = Arbiter.getLayerSchemas()[layerId];
			
			if(schema === null || schema === undefined){
				throw "Arbiter.Cordova.doneInsertingFeature - "
					+ "Could not get schema for layerId '"
					+ layerId + "'";
			}
			
			var srid = Arbiter.Map.getMap().projection.projCode;
			
			var wktGeometry = wktFormatter.write(Arbiter
					.Util.getFeatureInNativeProjection(
							srid, schema.getSRID(), feature));
			
			cordova.exec(null, null, "ArbiterCordova", "doneInsertingFeature", 
				[feature.layer.protocol.featureType, wktGeometry]);
		},
		
		syncCompleted: function(){
			
			cordova.exec(function(){
				Arbiter.Cordova.resetWebApp();
			}, null, "ArbiterCordova", "syncCompleted", []);
		},
		
		syncFailed: function(e){
			
			cordova.exec(null, null, "ArbiterCordova",
					"syncFailed", [e]);
		}
	};
})();