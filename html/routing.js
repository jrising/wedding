var wallsCtx = null;
var wallsReady = false;

function loadWalls() {
    var wallsCanvas = document.createElement('canvas');
    wallsCanvas.height = $('#canvas').height();
    wallsCanvas.width = $('#canvas').width();

    wallsCtx = wallsCanvas.getContext('2d');

    var walls = new Image();

    walls.onload = function() {
	    wallsReady = true;
	    wallsCtx.drawImage(walls, 0, 0, wallsCanvas.width, wallsCanvas.height);
    };
    walls.src = 'world/wpvupper-walls.png';
}

function getUnitVector(x0, y0, x1, y1) {
    var uu = x1 - x0;
    var vv = y1 - y0;
    var distance = Math.sqrt(Math.pow(uu, 2) + Math.pow(vv, 2));
    var uuunit = uu / distance;
    var vvunit = vv / distance;

    return {uuunit: uuunit, vvunit: vvunit, distance: distance};
}

function permitSlide(x0, y0, x1, y1) {
    unitvec = getUnitVector(x0, y0, x1, y1);

    // Check that no walls in between
    if (!permitPointSlide(x0, y0, unitvec.uuunit, unitvec.vvunit, unitvec.distance))
	    return false;

    // Check that no space for standing at destination
    if (!permitPointSlide(x1, y1, 1, 0, 10))
	    return false;
    if (!permitPointSlide(x1, y1, -1, 0, 10))
	    return false;
    if (!permitPointSlide(x1, y1, 0, 1, 10))
	    return false;
    if (!permitPointSlide(x1, y1, 0, -1, 10))
	    return false;

    return true;
}

function permitPointSlide(xx, yy, uuunit, vvunit, distance) {
    if (!wallsReady)
	    return false;

    for (var ii = 0; ii < distance; ii++) {
	    xx += uuunit;
	    yy += vvunit;

	    var pixel = wallsCtx.getImageData(Math.round(xx), Math.round(yy), 1, 1).data;
	    if (pixel[0] == 0)
	        return false;
    }

    return true;
}
