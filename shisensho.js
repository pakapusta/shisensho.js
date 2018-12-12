const COLUMNS = 18;
const ROWS = 10;

var images = [
	'img/bamboo-1.png',
	'img/bamboo-2.png',
	'img/bamboo-3.png',
	'img/bamboo-4.png',
	'img/bamboo-5.png',
	'img/bamboo-6.png',
	'img/bamboo-7.png',
	'img/bamboo-8.png',
	'img/bamboo-9.png',
	'img/circle-1.png',
	'img/circle-2.png',
	'img/circle-3.png',
	'img/circle-4.png',
	'img/circle-5.png',
	'img/circle-6.png',
	'img/circle-7.png',
	'img/circle-8.png',
	'img/circle-9.png',
	'img/dragon-green.png',
	'img/dragon-red.png',
	'img/dragon-white.png',
	'img/character-1.png',
	'img/character-2.png',
	'img/character-3.png',
	'img/character-4.png',
	'img/character-5.png',
	'img/character-6.png',
	'img/character-7.png',
	'img/character-8.png',
	'img/character-9.png'
	];

function multiplyArray(array, times) {
	var arr = [];
	for (var i = 0; i < times; i++) {
		for (var n = 0; n < array.length; n++) {
			arr.push(array[n]);
		}
	}
	return arr;
}

function shuffle(arr) {
	var j, x, i;
	for (i = arr.length -1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = arr[i];
		arr[i] = arr[j];
		arr[j] = x;
	}
	return arr;
}

function calcTileSize() {
	var widthHeightArray = new Array(2);
	widthHeightArray[0] = Math.ceil((window.innerWidth / COLUMNS + 2) * 0.7);
	widthHeightArray[1] = Math.ceil((window.innerHeight / ROWS + 2) * 0.7);
	return widthHeightArray;
}

imgArray = multiplyArray(images, 6);
shuffle(imgArray);
l = imgArray.length;


function matchTiles(tile1, tile2) {
	if (tile1.id === tile2.id) return false;
	if (tile1.imgSource !== tile2.imgSource) return false;
	var tile1X = tile1.xPosition + 1;
	var tile1Y = tile1.yPosition + 1;
	var tile2X = tile2.xPosition + 1;
	var tile2Y = tile2.yPosition + 1;
	var tile1n = {xPosition: tile1X, yPosition: tile1Y};
	var tile2n = {xPosition: tile2X, yPosition: tile2Y};
	var findedPath = findPath(tile1n, tile2n);
	return findedPath;
}

var findPathMatrix;

function findPath(tile1, tile2) {
	findPathMatrix = createMatrixforFinding();
	return ( checkOnDirection(tile1, tile2, "v", ROWS)
		||
		checkOnDirection(tile1, tile2, "h", COLUMNS)
		);
}

var path = [];

function checkOnDirection(tile1, tile2, direction, count) {
	var tile1X = tile1.xPosition;
	var tile1Y = tile1.yPosition;
	var tile2X = tile2.xPosition;
	var tile2Y = tile2.yPosition;
	var position1 = [tile1X, tile1Y];
	var position2 = [tile2X, tile2Y];
	var pathArray = new Array(3);
	var RPos, CPos;

	for (var i = 0; i <= count + 1; i++) {
		if (direction === "v") {
			RPos = [tile1X, i];
			CPos = [tile2X, i];
		} else {
			RPos = [i, tile1Y];
			CPos = [i, tile2Y];
		}
		pathArray[0] = [position1, RPos];
		pathArray[1] = [RPos, CPos];
		pathArray[2] = [CPos, position2];

		var valid = true;
	
		for (var p = 0; p < 3; p++) {
			valid = (valid && canMakePath({xPosition: pathArray[p][0][0], yPosition: pathArray[p][0][1]}, {xPosition: pathArray[p][1][0], yPosition: pathArray[p][1][1]}));
		}
		
		if (valid) {
			path = [];
			for (var p = 0; p < 3; p++) {
				path.push(pathArray[p]);
			}
			return true;
		}
	}
	return false;
}

function canMakePath(tile1, tile2) {
	var tile1X = tile1.xPosition;
	var tile1Y = tile1.yPosition;
	var tile2X = tile2.xPosition;
	var tile2Y = tile2.yPosition;
	if (tile1X === tile2X) {
		for (var i = Math.min(tile1Y, tile2Y); i <= Math.max(tile1Y, tile2Y); i++) {
			if (findPathMatrix[tile1X][i] !== 0) {
				return false;
			}
		}
		return true;
	}

	if (tile1Y === tile2Y) {
		for (var i = Math.min(tile1X, tile2X); i <= Math.max(tile1X, tile2X); i++) {
			if (findPathMatrix[i][tile1Y] !== 0) {
				return false;
			}
		}
		return true;
	}
	return false;
}

function createMatrixforFinding() {
	var i, j, idm, matrixPath = new Array(COLUMNS + 2);
	for (i = 0; i <= COLUMNS + 1; i++) {
		matrixPath[i] = new Array(ROWS + 2);
		for (j = 0; j <= ROWS + 1; j++) {
			matrixPath[i][j] = 0;
		}
	}
	for (i = 1; i <= COLUMNS; i++) {
		for (j = 1; j <= ROWS; j++) {
			var idmo = matrix.filter(tile => {
				return tile.xPosition === (i - 1) && tile.yPosition === (j - 1)
			});
			idm = idmo[0].id;
			matrixPath[i][j] = matrix[idm].state;
		}
	}
	return matrixPath;
}

async function drawPath() {
	createSVGPolyline();
	await sleep(250);
	var SVGdiv = document.getElementById('SVGWrap');
	SVGdiv.parentNode.removeChild(SVGdiv);
}

function createSVGPolyline() {
	var pointsString = "";
	for (var i = 0; i < path.length; i++) {
		for (var j = 0; j < path[i].length; j++) {
			if (i > 0 && j === 0) continue;
			var tileX = path[i][j][0];
			var tileY = path[i][j][1];
			if ( (tileX > 0 && tileX < 19) && (tileY > 0 && tileY < 11) ) {
				var idmo = matrix.filter(tile => {
					return tile.xPosition === (path[i][j][0] -1) && tile.yPosition === (path[i][j][1] - 1)
				});
				var boundingRect = document.getElementById(idmo[0].id).getBoundingClientRect();
				var centerX = boundingRect.left + (boundingRect.width / 2);
				var centerY = boundingRect.top + (boundingRect.height / 2);
			} else if (tileX === 0 && tileY === 0 ) {
				var idmo = matrix.filter(tile => {
					return tile.xPosition === (path[i][j][0]) && tile.yPosition === (path[i][j][1])
				});
				var boundingRect = document.getElementById(idmo[0].id).getBoundingClientRect();
				var centerX = boundingRect.left - (boundingRect.width / 2);
				var centerY = boundingRect.top - (boundingRect.height / 2);
			} else if (tileX === 19 && tileY === 0 ) {
				var idmo = matrix.filter(tile => {
					return tile.xPosition === (path[i][j][0] - 2) && tile.yPosition === (path[i][j][1])
				});
				var boundingRect = document.getElementById(idmo[0].id).getBoundingClientRect();
				var centerX = boundingRect.right + (boundingRect.width / 2);
				var centerY = boundingRect.top - (boundingRect.height / 2);
			} else if (tileX === 19 && tileY === 11 ) {
				var idmo = matrix.filter(tile => {
					return tile.xPosition === (path[i][j][0] - 2) && tile.yPosition === (path[i][j][1] - 2)
				});
				var boundingRect = document.getElementById(idmo[0].id).getBoundingClientRect();
				var centerX = boundingRect.right + (boundingRect.width / 2);
				var centerY = boundingRect.bottom + (boundingRect.height / 2);
			} else if (tileX === 0 && tileY === 11 ) {
				var idmo = matrix.filter(tile => {
					return tile.xPosition === (path[i][j][0]) && tile.yPosition === (path[i][j][1] - 2)
				});
				var boundingRect = document.getElementById(idmo[0].id).getBoundingClientRect();
				var centerX = boundingRect.left - (boundingRect.width / 2);
				var centerY = boundingRect.bottom + (boundingRect.height / 2);
			} else if (tileX > 0 && tileY === 0 ) {
				var idmo = matrix.filter(tile => {
					return tile.xPosition === (path[i][j][0] - 1) && tile.yPosition === (path[i][j][1])
				});
				var boundingRect = document.getElementById(idmo[0].id).getBoundingClientRect();
				var centerX = boundingRect.left + (boundingRect.width / 2);
				var centerY = boundingRect.top - (boundingRect.height / 2);
			} else if (tileX === 19 && tileY > 0 ) {
				var idmo = matrix.filter(tile => {
					return tile.xPosition === (path[i][j][0] - 2) && tile.yPosition === (path[i][j][1] - 1)
				});
				var boundingRect = document.getElementById(idmo[0].id).getBoundingClientRect();
				var centerX = boundingRect.right + (boundingRect.width / 2);
				var centerY = boundingRect.bottom - (boundingRect.height / 2);
			} else if (tileX < 19 && tileY === 11 ) {
				var idmo = matrix.filter(tile => {
					return tile.xPosition === (path[i][j][0] - 1) && tile.yPosition === (path[i][j][1] - 2)
				});
				var boundingRect = document.getElementById(idmo[0].id).getBoundingClientRect();
				var centerX = boundingRect.left + (boundingRect.width / 2);
				var centerY = boundingRect.bottom + (boundingRect.height / 2);
			} else if (tileX === 0 && tileY < 11 ) {
				var idmo = matrix.filter(tile => {
					return tile.xPosition === (path[i][j][0]) && tile.yPosition === (path[i][j][1] - 1)
				});
				var boundingRect = document.getElementById(idmo[0].id).getBoundingClientRect();
				var centerX = boundingRect.left - (boundingRect.width / 2);
				var centerY = boundingRect.bottom - (boundingRect.height / 2);
			}

			if ( i < path.length - 1 ) {
				pointsString += centerX + ", " + centerY + ", ";
			} else {
				pointsString += centerX + ", " + centerY;
			}
		}
	}

	var ns = 'http://www.w3.org/2000/svg'
	var div = document.getElementById('board');
	var boardRect = div.getBoundingClientRect();
	var widthString = boardRect.width + (boardRect.width / 18) * 2 + 'px';
	var heightString = boardRect.height + (boardRect.height / 10) * 2 + 'px';
	var divSVG = div.appendChild(document.createElement('div'));
	divSVG.className = "absPos";
	divSVG.id = "SVGWrap";
	var svg = document.createElementNS(ns, 'svg');
	svg.setAttributeNS(null, 'width', widthString)
	svg.setAttributeNS(null, 'height', heightString)
	divSVG.appendChild(svg)
	var polyline = document.createElementNS(ns, 'polyline');
	polyline.setAttributeNS(null, 'points', pointsString);
	polyline.setAttributeNS(null, 'style', 'fill:none; stroke:red; stroke-width:3');
	svg.appendChild(polyline);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function checkNextMovePos() {
	for (var i = 0; i < images.length; i++) {
		var image = images[i];
		var moa = matrix.filter(tile => {
			return tile.imgSource ===  image && tile.state === 1;
		});
		var moalength = moa.length;
		for (var j = 0; j < moalength; j++) {
			for (var k = j+1; k < moalength; k++) {
				moa[j].state = 0;
				moa[k].state = 0;
				var match = matchTiles(moa[j], moa[k]);
				moa[j].state = 1;
				moa[k].state = 1;
				if (match) return true;
			}
		}
	}
	return false;
}

function checkWin() {
	var moa = matrix.filter(tile => {
		return tile.state === 1;
	});
	if (moa.length === 0) return true;
	return false;
}

matrix = [];

(function() {
	for (var r = 0; r < ROWS; r++) {
		for ( var c = 0; c < COLUMNS; c++) {
			var Id = (r*COLUMNS+ c);
			matrix.push({
				id: Id,
				xPosition: c,
				yPosition: r,
				state: 1,
				imgSource: imgArray[Id]
			});
		}
	}
	})();

(function() {
	var divUpper = document.createElement('div');
	divUpper.className = "upperDiv";
	divUpper.id = "board";
	var img, divRow;
	for(var i = 0; i < l; i++) {
		if(i % COLUMNS == 0) {
			divRow = divUpper.appendChild(document.createElement('div'));
			divRow.className = "row";
		}
		img = divRow.appendChild(document.createElement('img'));
		img.id = i.toString();
		img.src = matrix[i].imgSource;
	}
	document.body.appendChild(divUpper);
})();

function appendStyle(style) {
	var css = document.createElement('style');
	css.type = 'text/css';
	if (css.styleSheet) {
		css.styleSheet.cssText = style;
	} else {
		css.appendChild(document.createTextNode(style));
	}
	document.getElementsByTagName("head")[0].appendChild(css);
}

(function() {	
	var tileSize = calcTileSize();
	var tileWidth = tileSize[0];
	var tileHeight = tileSize[1];
	var style = "img { width: " + tileWidth.toString() + "px; height: " 
		+ tileHeight.toString() + "px; }";
	appendStyle(style);
})();


selectedOneBool = false;
selectedTwoBool = false;
selectedOneObject = null;
selectedTwoObject = null;

function clickTile() {
	return function(evnt) {
		var counterSelected = 0;
		if(selectedOneBool !== true) {
			selectedOneBool = true;
			selectedOneObject = document.getElementById(evnt.target.id.toString());
			selectedOneObject.setAttribute("class", "selected");
			counterSelected++;
		} else if( (selectedTwoBool !== true) && (selectedOneBool === true) && (counterSelected < 2) ) {
			selectedTwoBool = true;
			var idOne = selectedOneObject.id;
			var idTwo = evnt.target.id;
			selectedTwoObject = document.getElementById(idTwo.toString());
			selectedTwoObject.setAttribute("class", "selected");
			counterSelected++;
			var firstTile = matrix[idOne];
			var secondTile = matrix[idTwo];
			firstTile.state = 0;
			secondTile.state = 0;
			if( matchTiles(firstTile, secondTile)) {
				drawPath();
				selectedOneObject.setAttribute("class", "deleted");
				selectedTwoObject.setAttribute("class", "deleted");
				selectedOneBool = false;
				selectedTwoBool = false;
				selectedOneObject = null;
				selectedTwoObject = null;
				couterSelected = 0
				path = [];
				var won = checkWin();
				if (!checkNextMovePos() && !won) alert("There are no moves left. Game is blocked"); 
				if (won) alert("You WON!!!");
			} else {
				selectedOneBool = false;
				selectedTwoBool = false;
				counterSelected = 0;
				selectedOneObject.removeAttribute("class");
				selectedTwoObject.removeAttribute("class");
				firstTile.state = 1;
				secondTile.state = 1;
			}
		} else {
			selectedOneBool = false;
			selectedTwoBool = false;
			counterSelected = 0;
			selectedOneObject.removeAttribute("class");
			selectedTwoObject.removeAttribute("class");
		}
	};
}

imgTiles = document.getElementsByTagName('img');
for( var i = 0; i < imgTiles.length; i++ ) {
	imgTiles[i].addEventListener('click', clickTile());
}
