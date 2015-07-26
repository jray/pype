
# Pype

Sequential stream processing with dependency injection

```javascript

var pype  = require( 'pype' );
var es    = require( 'event-stream' );

// given a mapping stream
var mapStream = function( mapFunc ) {
  return es.map(function(data, callback) {
    var result = mapFunc( data );
    callback( null, result );
  });
};

// some dependencies
var deps = {
  foo: 1,
  bar: function( item ) {
    return item * 3;
  }
};

// Put the streams in an array (mindful of order!) and wrap each one in a
// function which accepts dependencies as arguments.
// Note: argument names MUST match a key in the deps object
var funcs = [
  function( foo ) {
    return utils.mapStream(function(item) {
      item.foo = foo * 2;
      return item;
    });
  },

  function( bar ) {
    return utils.mapStream(function(item) {
      item.bar = bar( item.foo );
      return item;
    });
  }
];

pype( funcs, deps )
  .on('data', function( data ) {
    t.equal( data.foo, 2 );
    t.equal( data.bar, 6 );
    t.end();
  })
  .on('error', function(e){
    throw e;
  }).write( {} );

```
