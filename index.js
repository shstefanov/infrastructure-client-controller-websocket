var _                = require("fixed.underscore");
var helpers          = require("lib.helpers"); 
var Controller       = require("lib.Controller");
var WebsocketWrapper = require("./lib/WebsocketWrapper")

module.exports   = Controller.extend("BaseWebsocketController", {

  init: function(options, cb){
    options.settings.sockets ? this.setupSockets(options.settings.sockets, cb) : cb();
  },

  setupSockets: function(sockets, cb){
    var io = require("socket.io-client");
    var app = this.app;
    
    helpers.amap(sockets, [
      function(settings, cb){
        var socket = io.connect([settings.protocol, settings.host, ":", settings.port, "?", settings.query].join(""),  settings);
        socket.once("connect", function(){
          cb( null, socket, settings );
        });
      },

      function(socket, settings, cb){
        socket.once("init", function(initData){
          cb( null, socket, settings, initData );
        });
      },

      function(socket, settings, initData, cb){
        cb(null, new WebsocketWrapper(socket, settings, initData));
      },

      ], function(err, socket_apps){   if(err) return cb(err);
      app.websockets = socket_apps;
      cb();
    });
  } 

});
