
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

exports.upSwitch = function ( user, bucket, db ) {
	
	//Can't upshift into a bucket before the current one, or from one that doesn't exist.
	
	if ( bucket <= db.get( "currentbucket" ) || !db.get( "bucket_" + bucket ) ) {
		return false;
	}
	else {
		
		//Get index for the bucket above, and fetch it.
		var newBucket = "bucket_" + ( bucket - 1 );
		bucket = "bucket_" + bucket;
		var newTracks = db.get( newBucket );
		var oldTracks = db.get( bucket );

		var oldTrackData, newTrackData;
		
		oldTracks.forEach( function ( queuedTrack ) {
			if ( queuedTrack.user == user ) {
				oldTrackData = queuedTrack;
			}
		});

		newTracks.forEach( function ( queuedTrack ) {
			if ( queuedTrack.user == user ) {
				newTrackData = queuedTrack;
			}
		});

		if ( oldTrackData == undefined || newTrackData == undefined ) {
			console.log("One of the trackdatas is undefined");
			return false;
		}
		
		else {
			oldTracks[oldTracks.indexOf( oldTrackData )] = newTrackData;
			newTracks[newTracks.indexOf( newTrackData )] = oldTrackData;
		}
	
		db.set( bucket, oldTracks );
		db.set( newBucket, newTracks );
	}

}

function upshift ( user, bucket, db ) {
	
	var nextBucket = "bucket_" + ( bucket + 1 )
	bucket = "bucket_" + bucket;
	console.log( bucket );
	
	if ( !db.get( bucket ) ) {
		return false;
	}
	else { 
		if ( db.get( nextBucket ) ) {
			var nextTracks = db.get( nextBucket );
			var nextTrackData;
			var theseTracks = db.get( bucket );
						
			nextTracks.forEach( function ( queuedTrack ) {
				if ( queuedTrack.user == user ) {
					nextTrackData = queuedTrack;
				}
			});

			if ( nextTrackData != undefined ) {
				theseTracks.forEach( function ( queuedTrack ) {
					if ( queuedTrack.user == user ) {
						queuedTrack.track = nextTrackData.track;			
					}
				});
	
				db.set( bucket, theseTracks );
				return true;
			}
			else {		
				theseTracks.forEach( function ( queuedTrack ) {
					if ( queuedTrack.user == user ) {
						theseTracks.splice( theseTracks.indexOf( queuedTrack ), 1);
					}
				});
	

				if ( theseTracks.length < 1 ) {
					db.rm ( bucket );
				}
				else {
		
					db.set( bucket, theseTracks );
					return true;
				}
			}
		}
	}
}	
	

exports.deleteTrack = function ( user, bucket, db ) {
	

	if ( !db.get( "bucket_"+bucket ) ) {
		//HNNNNNNNNNNNG.
		return false;
	}
	else {
		var bucketIndex = bucket;
		var userData = db.get( "user_" + user );
	
		while ( bucketIndex <= userData.bucket ) {
			upshift( user, bucketIndex, db );
			bucketIndex++;
		}
	}

	var userData = db.get( user );
	userData.bucket--;
	db.set( user, userData ); 

}
