// rxjs-pubsub.js
// repo    : https://github.com/richardanaya/rxjs-pubsub
// license : MIT

(function (window, module) {
  "use strict";
  var rx = Rx;
  if(!rx){
    rx = require("rxjs")
  }

  var CustomSubject = function(){
      rx.Subject.call(this);
  }
  CustomSubject.prototype = Object.create(rx.Subject.prototype);
  CustomSubject.prototype.onCompleted = function(){}
  CustomSubject.prototype.onError = function(error){
      this.error = error;
      this.observers.forEach(function(o){
          o.isStopped = false;
          o.onError(error);
      });
  }


  function create(){
    var listeners = [];
    function publish(channel,value){
     var listener = listeners[channel];
     if(listener!=null){
        listener.onNext(value)
     }
    }
    function subscribe(channel){
     var listener = listeners[channel];
     if(listener==null){
        listeners[channel] = listener = new CustomSubject();
     }
     return listener;
    }
    subscribe.publish = publish;
    return subscribe;
  }

  window.pubsub = module.exports = {
    create : create
  };
})(
  typeof window !== "undefined" ? window : {},
  typeof module !== "undefined" ? module : {}
);
