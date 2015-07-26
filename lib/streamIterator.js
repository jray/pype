
'use strict';

var es    = require( 'event-stream' );

exports.parseFuncSig = function( func ) {
  var funcStr = func.toString().replace( /\s/g, '' );

  var firstOpeningParenIndex = funcStr.indexOf( '(' );
  var firstClosingParenIndex = funcStr.indexOf( ')' );

  return funcStr
    .substring( firstOpeningParenIndex + 1, firstClosingParenIndex )
    .split( ',' );
};

exports.matchDeps = function( depsList, deps ) {
  var i;
  var retDeps = {};
  return depsList.map(function( dep ) {
    return deps[ dep ];
  });
};

exports.resolve = function( func, deps ) {
  var depsList = exports.parseFuncSig( func );
  var mappedDeps = exports.matchDeps( depsList, deps );
  return mappedDeps;
};

exports.iteratePipeline = function( funcs, deps ) {
  var streams = funcs.map(function( func ) {
    var mappedDeps = exports.resolve( func, deps );
    return func.apply( null, mappedDeps );
  });
  return es.pipeline.apply( es, streams );
};
