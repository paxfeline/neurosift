// ==UserScript==
// @name				NeuroSift
// @namespace		net.pax.dev
// @include			http://neurosynth.org/studies/*
// @version			2
// ==/UserScript==

// NeuroSift Copyright © 2018 David Newberry and Megan Finnegan, all rights reserved.

/* Usage notes:
	This script will harvest voxels from a table of activation neurosynth study. */

var ORIG; // default [ -48, 40, -6 ]
var THRESH; // default 8;

// ask user for origin point

ORIG = prompt( "Enter coordinates to search around (in default units).", "x, y, z" ).split( "," );

// explicitly convert strings to numbers
ORIG.forEach( function ( el, ind, arr ) { arr[ind] = parseFloat( el ); } );

while ( ORIG.length != 3 || isNaN( ORIG[0] ) || isNaN( ORIG[1] ) || isNaN( ORIG[2] ) )
{
	ORIG = prompt( "Poorly formed input.\nRe-enter coordinates to search around (in default units).", "-48, 40, -6" ).split( "," );

	// explicitly convert strings to numbers
	ORIG.forEach( function ( el, ind, arr ) { arr[ind] = parseFloat( el ); } );
}

// ask user for threshold distance

THRESH = parseFloat( prompt( "Enter threshold (in default units).", "8" ) );

while ( isNaN( THRESH ) )
	THRESH = parseFloat( prompt( "Poorly formed input.\nEnter threshold (in default units).", "8" ) );

// begin repetatively calling a function to read in all points

var lastStart = null;
var o = new Array();

var mode = 0;

setTimeout(
	function again ()
	{
		var flag = false; // flag for "all done"

		var info = document.querySelector( "#study_peaks_table_info" );

		if ( info )
		{
			// when not fully loaded, may read '0 to 0 of 0'
			var re = /Showing (\d+) to (\d+) of (\d+) entries/gi;
			var found = re.exec( info.innerHTML );
			
			// mode 0/1 is used to ensure we start on page 1
			if ( found[1] > 0 && mode == 0 )
			{
				if ( found[1] > 1 )
				{
					//alert( "downshift" );
					
					// click the "first" button
					var el = document.querySelector( "#study_peaks_table_first" );
					var e = new Event('click');
					el.dispatchEvent(e);
					
					// by setting lastStart here, we ensure that the subsequent conditional will be triggered after turning from whatever page now specified [to page 1]
					lastStart = found[1];
				}
				
				mode = 1;
			}
			else if ( mode == 1 )
			{
			
				if ( found[1] > 0 && ( !lastStart || lastStart != found[1] ) )
				{
					lastStart = found[1];

					// iterate through each row in the table
					var rows = document.querySelectorAll( "#study_peaks_table tbody tr" );

					for ( var row of rows )
					{
						var line = new Array();
						var cs = row.querySelectorAll( "td" );

						// put each table cell's text for this row into an array
						for ( var i = 1; i < cs.length; i++ )
							line.push( cs[i].textContent );

						unsafeWindow.console.log( "line", line );

						// use the constructed array (which contains primarily a set of coordinates) to find distance to 'ORIG' point
						var d = dist3( ORIG, line );

						unsafeWindow.console.log( "d", d );

						// if the distance is less than THRESH, add this point to those being outputted
						if ( d <= THRESH )
						{
							line.push( " table " + cs[0].textContent );
							o.push( line.join( "," ) );
						}
					}

					// found[2] == found[3] means the final page has been reached, and the script can finish
					if ( found[2] == found[3] )
						flag = true;
					else
					{
						// click the "next" button
						var el = document.querySelector( "#study_peaks_table_next" );
						var e = new Event('click');
						el.dispatchEvent(e);
					}
				}
			}
			
		}

		// if done, output.
		// else, set timeout to call this function again.
		if ( flag )
		{
			var ta = document.createElement( "textarea" );
			ta.style.height = "20em";
			ta.innerHTML = o.join( "\n" );
			document.body.appendChild( ta );
		}
		else
			setTimeout( again, 10 );
	},
	10 );

// utility function for Euclidean distance (given our particular data structures)

/* 
	dist3 takes two inputs,
		each an arry with [at least] 3 elements; call them
			ar1 = [ x1, y1, z1 ],
			ar2 = [ x2, y2, z2 ]
	Returns:
		sqrt( (x1 - x2)^2 + (y1 - y2)^2 + (z1 - z2)^2 )
*/

function dist3( ar1, ar2 )
{
	var c = 0;
	for ( var i = 0; i < 3; i++ )
		c += Math.pow( ar1[i] - ar2[i], 2 )
	return Math.sqrt( c );
}