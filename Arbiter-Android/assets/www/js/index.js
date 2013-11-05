var app = (function(){
	
	var waitFuncs = [];
	var ArbiterInitialized = false;
	
	return {
		tileCounter: 0,
		
		RESET_ARBITER_ON: 150,
		
		waitForArbiterInit: function(func){
			if(!ArbiterInitialized){
				waitFuncs.push(func);
			}else{
				func.call();
			}
		},
	
		overrideGetURL: function(layer){
			// Call OpenLayers.Layer.WMS getURL
			layer.getURL = function(bounds){
				var url = Object.getPrototypeOf(this).getURL.call(this, bounds);
				app.tileCounter++;
				
				return url;
			};
		},
		
		/**
		 * Initialize the app
		 */
	    Init: function() {
	        this.bindEvents();
	    },
	    
	    /**
	     * Bind event listeners
	     */
	    bindEvents: function() {
	        document.addEventListener('deviceready', this.onDeviceReady, false);
	    },
		
	    /**
	     * On device ready
	     */
	    onDeviceReady: function() {
	    	Arbiter.Init();
	    	
	    	for(var i = 0; i < waitFuncs.length; i++){
	    		waitFuncs[i].call();
	    	}
	    	
	    	ArbiterInitialized = true;
	    	
	    	app.registerMapListeners();
	    },
	    
	    registerMapListeners: function(){
	    	var map = Arbiter.Map.getMap();
	    	map.events.register("moveend", this, function(event){
	    		if(app.tileCounter > app.RESET_ARBITER_ON){
	    			app.resetWebApp();
	    		}
	    	});
	    },
	    
	    /**
	     * Save the current maps extent
	     */
	    resetWebApp: function(){ 
	    	var bbox = Arbiter.Map.getCurrentExtent().toBBOX();
	    	var zoom = Arbiter.Map.getZoom();
	    	
	    	cordova.exec(null, null, "ArbiterCordova", "resetWebApp", [bbox, zoom]);
	    },
	    
	    /**
	     * Get the area of interest in the aoi map and call
	     * the native method to create the project with the aoi
	     */
	    setNewProjectsAOI: function(){
	    	var bbox = Arbiter.Map.getCurrentExtent().toBBOX();
	    	cordova.exec(null, null, "ArbiterCordova", "setNewProjectsAOI", [bbox]);
	    },
	    
	    zoomToExtent: function(left, bottom, right, top, zoomLevel){
	    	if(zoomLevel === null || zoomLevel === undefined){
	    		Arbiter.Map.zoomToExtent(left, bottom, right, top);
	    	}else{
	    		Arbiter.Map.setCenter(left, bottom, right, top, zoomLevel);
	    	}
	    },
	    
	    clearMap: function(){
	    	Arbiter.Map.Layers.removeAllLayers();
	    },
	    
	    addLayers: function(layers, includeDefaultLayer){
	    	var layer;
	    	
	    	if(includeDefaultLayer){
	    		var osmLayer = new OpenLayers.Layer.OSM("OpenStreetMap", null, {
	    			transitionEffect: 'resize'
				});
	    		
	    		Arbiter.Map.Layers.addLayer(osmLayer);
	    		
	    		this.overrideGetURL(osmLayer);
	    	}
	    	
	    	for(var i = 0; i < layers.length; i++){
	    		
	    		layer = new OpenLayers.Layer.WMS(Arbiter.Map.Layers.getLayerName(layers[i].layerId, "wms"), layers[i].serverUrl + "/wms", 
	    				{
	    					layers: layers[i].featureType,
	    					transparent: true,
	    					format: "image/png"
	    					
	    				},
	    				{
	    					isBaseLayer: false,
	    					transitionEffect: 'resize',
	    					visibility: true
	    				});
	    		
	    		this.overrideGetURL(layer);
	    		
	    		Arbiter.Map.Layers.addLayer(layer);
	    	}
	    },
	    
	    loadMap: function(layers, includeDefaultLayer){
	    	console.log("loadMap: ", layers, includeDefaultLayer);
	    	if((layers === null || layers === undefined) 
	    			&& !includeDefaultLayer){
	    		return;
	    	}
	    	
	    	this.clearMap();
	    	
	    	this.addLayers(layers, includeDefaultLayer);
	    	
	    	var map = Arbiter.Map.getMap();
	    	if(map.layers.length){
	        	Arbiter.Map.Layers.setNewBaseLayer(map.layers[0]);
	    	}
	    },
	    
	    removeLayer: function(layerId){
	    	Arbiter.Map.Layers.removeLayerById(layerId);
	    },
	    
	    removeDefaultLayer: function(){
	    	Arbiter.Map.Layers.removeLayerByName("OpenStreetMap");
	    }
	};
})();

app.Init();