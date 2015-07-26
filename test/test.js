
'use strict';

var test            = require( 'tape' );
var streamIterator  = require( '../lib/streamIterator' );
var es              = require( 'event-stream' );
var utils           = require( '../lib/utils' );
var resumer         = require( 'resumer' );
var pype            = require( '../index' );

test('Parse function arguments', function( t ) {
  t.plan( 2 );
  var testFunc = function ( foo, bar ) {};
  var result = streamIterator.parseFuncSig( testFunc );
  t.equal( result[ 0 ], 'foo' );
  t.equal( result[ 1 ], 'bar' );
});

test('Passes deps successfully', function( t ) {
  t.plan( 2 );
  var depsList = [ 'foo', 'bar' ];
  var deps = {
    foo: 1,
    bar: 2,
    baz: 3
  };

  var result =
  streamIterator
    .matchDeps( depsList, deps );

  t.equal( result[ 0 ], deps.foo );
  t.equal( result[ 1 ], deps.bar );
});

test('works', function( t ) {
  var deps = {
    foo: 1,
    bar: function( item ) {
      return item * 3;
    }
  };
  var str1 = function( foo ) {
    return utils.mapStream(function(item) {
      item.foo = foo * 2;
      return item;
    });
  };

  var str2 = function( bar ) {
    return utils.mapStream(function(item) {
      item.bar = bar( item.foo );
      return item;
    });
  };

  var funcs = [ str1, str2 ];

  pype( funcs, deps )
    .on('data', function( data ) {
      t.equal( data.foo, 2 );
      t.equal( data.bar, 6 );
      t.end();
    })
    .on('error', function(e){
      throw e;
    }).write( {} );

});





