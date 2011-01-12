
exports.queueTrack = function ( user, track, db ) {
	var bucketName, currentBucket = db.get( "currentbucket" );

	var userName = "user_"+user;

	track = "file_"+track;

	if ( db.get( userName ) ) {
		userdata = db.get( userName );
	}
	else {
		//So they've queued a song without a registered user? No.
		return;
	}

	//Define the user's last bucket, if it doesn't exist.

	if ( userdata.bucket == undefined ) {
		userdata.bucket = ( currentBucket - 1 );
	}
		
	var newBucket = "bucket_";
			
	var queueData = { "user" : user, "track" : track };

	//Was their last queue before the current bucket? Add to current bucket.
	
	if ( userdata.bucket < currentBucket ) {
		newBucket += currentBucket;
	}
	
	//If not, add it to the one after the current bucket.
	
	else {
		newBucket += ( userdata.bucket + 1 );
	}

	//Push the track to the array stored in the bucket where the track will get queued.

	if ( db.get( newBucket ) ) {
		var tracks = db.get( newBucket );
		tracks.push( queueData );
		db.set ( newBucket, tracks );
	}	
	else {
		db.set ( newBucket, [queueData] );
	}

	//Increment the user's bucket counter.

	userdata.bucket++;
	db.set( userName, userdata );

}
