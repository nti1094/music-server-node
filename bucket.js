#!/home/mrwilson/node-v0.2.5/node

var fs = require( 'fs' ), sys = require( 'sys' );

exports.queueTrack = function ( user, track, db ) {
	var bucket_name, current_bucket = db.get( "currentbucket" );

	var user_name = "user_"+user;

	track = "file_"+track;

	if ( db.get( user_name ) ) {
		userdata = db.get( user_name );
	}
	else {
		//What?! So they've queued a song without a registered user? /o\
	}

	if ( userdata.bucket === undefined ) {
		userdata.bucket = current_bucket;
	}
		
	var new_bucket = "bucket_";
			
	var queue_data = { "user" : user, "track" : track };

	//Was their last queue before the current bucket?
	
	if ( userdata.bucket < current_bucket ) {
		new_bucket += current_bucket;
	}
	
	//If not, add it to the one after the current bucket.
	
	else {
		new_bucket += ( userdata.bucket + 1 );
	}

	if ( db.get( new_bucket ) ) {
		var tracks = db.get( new_bucket );
		tracks.push( queue_data );
		db.set ( new_bucket, tracks );
	}	
	else {
		db.set ( new_bucket, new Array( queue_data ) );
	}

	userdata.bucket++;
	db.set( user_name, userdata );

} 
