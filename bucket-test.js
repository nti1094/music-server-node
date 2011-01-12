#!/home/mrwilson/node-v0.2.5/node

var db = require( './lib/dirty' )('music-server.db');
var test = require('./bucket.js');

db.set( "currentbucket", 2);
db.set( "user_Bubbles", {"bucket" : 1});
db.set( "user_Buttercup", {} );
db.set( "user_Blossom", {"bucket" : 3});

db.set( "file_test1", { "track" : "2 Doors Down", "artist" : "Mystery Jets" });
db.set( "file_test2", { "track" : "All Rise", "artist" : "Blue" });
db.set( "file_test3", { "track" : "Back In Black", "artist" : "ACDC" });
db.set( "file_test4", { "track" : "1999", "artist" : "Dr. Busker"});

test.queueTrack( "Blossom", "test1", db );
test.queueTrack( "Bubbles", "test2", db );
test.queueTrack( "Buttercup", "test3", db );
test.queueTrack( "Bubbles", "test4", db );

db.forEach( function ( key, val ) {
	if ( /bucket_/.exec( key ) != null ) {
		console.log("Bucket = "+key.split("_")[1]);
		for( var i in val ) {
			var data = db.get( val[i].track );
			console.log( data.track+" - "+data.artist+". Queued by "+val[i].user );
		}
		console.log("\n");
	}
});
 

