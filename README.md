# Neuro-sift
Harvest voxels mentioned in papers in Neurosynth by proximity to an input voxel. Uses Greasemonkey (Firefox add-on).

To install the Greasemonkey script, you must first upload the nsv2.user.js script to a server and navigate to the file in Firefox. Greasemonkey will recognize the script and prompt you to install it. Once it's been installed into Greasemonkey, it can be quickly edited by selecting it from the Greasemonkey menu (little monkey face to right of the address bar).

For the time being, if you don't have access to a server to upload the script yourself, you can use [this link](http://sfcstech.x10.mx/nsv2.user.js).

Once the script is installed, it will automatically run any time a webpage under the directory http://neurosynth.org/studies/ is loaded. It will harvest activations from the table, and then present them in a textfield at the bottom of the page.

Usage notes:
- This script will harvest voxels from a table of activations discussed in a paper in the Neurosynth repository.