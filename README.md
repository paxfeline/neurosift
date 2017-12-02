# neurosift
Harvest voxels by proximity to input.

Usage notes:
- This script will harvest voxels from a table of activation neurosynth study.
	
- First set up the ORIG and THRESH parameters.
  - ORIG - The central voxel.
  - THRESH - The radius around the ORIG voxel to check for.
	
- To be safe, the script should be run in a Private Window. This is because neurosynth remembers where you are in a table (for example if you have clicked to page 3), and the script would harvest data only from that page on. By using a Private Window, the studies will load with page 1 of the table visible.