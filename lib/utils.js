
'use strict';

var es = require( 'event-stream' );

exports.mapStream = function( mapFunc ) {
  return es.map(function(data, callback) {
    var result = mapFunc( data );
    callback( null, result );
  });
};
