// ==UserScript==
// @name        Neuro sift
// @namespace   com.cool.pax
// @include     http://neurosynth.org/studies/*
// @version     1
// ==/UserScript==

/* Usage notes:
	This script will harvest voxels from a table of activation neurosynth study.

	First set up the ORIG and THRESH parameters.
		ORIG - The central voxel.
		THRESH - The radius around the ORIG voxel to check for.

	To be safe, the script should be run in a Private Window.
	This is because neurosynth remembers where you are in a table
	(for example if you have clicked to page 3), and the script would
	harvest data only from that page on.
	By using a Private Window, the studies will load with page 1 of the table visible. */

// Change values:

var ORIG = [ 0, 0, 0 ];

var THRESH = 8;




function dist3( ar1, ar2 )
{
	var c = 0;
	for ( var i = 0; i < 3; i++ )
		c += Math.pow( ar1[i] - ar2[i], 2 )
	return Math.sqrt( c );
}

var lastStart = null;
var o = new Array();

setTimeout(
	function again ()
	{
		var info = document.querySelector( "#study_peaks_table_info" );

		var flag = false;

		if ( info )
		{
			var re = /Showing (\d+) to (\d+) of (\d+) entries/gi;
			var found = re.exec( info.innerHTML );

			if ( found[1] > 0 && ( !lastStart || lastStart != found[1] ) )
			{
				lastStart = found[1];

				var rows = document.querySelectorAll( "#study_peaks_table tbody tr" );

				for ( var row of rows )
				{
					var line = new Array();
					var cs = row.querySelectorAll( "td" );
					for ( var i = 1; i < cs.length; i++ )
					line.push( cs[i].textContent );
					if ( dist3( ORIG, line ) <= THRESH )
					{
						line.push( " table " + cs[0].textContent );
						o.push( line.join( "," ) );
					}
				}

				if ( found[2] == found[3] )
					flag = true;
				else
				{
					var el = document.querySelector( "#study_peaks_table_next" );
					var e = new Event('click');
					el.dispatchEvent(e);
				}
			}
		}

		if ( flag )
		{
			var ta = document.createElement( "textarea" );
			ta.innerHTML = o.join( "\n" );
			document.body.appendChild( ta );
		}
		else
			setTimeout( again, 10 );
	},
	10 );