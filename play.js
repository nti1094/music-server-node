var child = require( 'child_process' );
var timeOut = 360; //time in seconds before timeout.


exports.play = function ( db ) {

        var currentBucketIndex;
	var bucket;


        if ( !db.get( "currentbucket" ) ) {
                return false;
	}
        else {
		currentBucketIndex = "bucket_"+db.get( "currentbucket" );
	}





function playTracks ( bucket, db ) {

	var thisBucket;

	if ( !db.get( "bucket_"+bucket ) ) {
		//UGGGGHHHHHH
		exit(0);
		//If someone queues a track, start playing?
	}

	else {
		thisBucket = db.get( "bucket_"+bucket );
	}

	var track = thisBucket.unshift().track;	

	if ( !db.get ( "file_"+track ) ) {
		bucketContents =  db.get( "bucket_" + bucket );
		bucketContents.unshift();
		db.set( thisBucket, bucketContents );
		
		if ( bucketContents.length < 1 ) {
			db.set( "currentbucket", db.get( "currentbucket" + 1 ) );
			playTrack( bucket + 1, db);
		}
		else {
			playTrack( bucket, db );
		}
	}
	else {

		var play = child.exec( "mplayer "+ , {timeout : timeOut*1000}, function ( err, stdout, stderr ) {
	
			play.on( 'exit', function () {
				bucketContents =  db.get( thisBucket );
				currentBucket.unshift();
				db.set( thisBucket, bucketContents );
				
				if ( bucketContents.length < 1 ) {
					db.set( "currentbucket", db.get( "currentbucket" ) + 1 ) );
					playTrack( bucket + 1 , db );
				else {
					playTrack( bucket, db);
				}
			});
		});
	}
}
