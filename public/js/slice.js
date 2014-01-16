var height = 0;
var shelves = 0;
var shelf_width = 0;

function rgbToHex(R,G,B) {return "#" + toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}

function findNearest(bookArray, book) {

}

// I didn't write this
function RGBtoXYZ(R, G, B) {
    var_R = parseFloat(R / 255); //R from 0 to 255
    var_G = parseFloat(G / 255); //G from 0 to 255
    var_B = parseFloat(B / 255); //B from 0 to 255

    if (var_R > 0.04045) {
        var_R = Math.pow(((var_R + 0.055) / 1.055), 2.4);
    } else {
        var_R = var_R / 12.92;
    }
    if (var_G > 0.04045) {
        var_G = Math.pow(((var_G + 0.055) / 1.055), 2.4);
    } else {
        var_G = var_G / 12.92;
    }
    if (var_B > 0.04045) {
        var_B = Math.pow(((var_B + 0.055) / 1.055), 2.4);
    } else {
        var_B = var_B / 12.92;
    }

    var_R = var_R * 100;
    var_G = var_G * 100;
    var_B = var_B * 100;

    //Observer. = 2°, Illuminant = D65
    X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
    Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
    Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;
    return [X, Y, Z];
}
// or this
function XYZtoLAB(vars) {
    var x = vars[0];
    var y = vars[1];
    var z = vars[2];

    var ref_X = 95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;

    var_X = x / ref_X; //ref_X =  95.047   Observer= 2°, Illuminant= D65
    var_Y = y / ref_Y; //ref_Y = 100.000
    var_Z = z / ref_Z; //ref_Z = 108.883

    if (var_X > 0.008856) {
        var_X = Math.pow(var_X, (1 / 3));
    } else {
        var_X = (7.787 * var_X) + (16 / 116);
    }
    if (var_Y > 0.008856) {
        var_Y = Math.pow(var_Y, (1 / 3));
    } else {
        var_Y = (7.787 * var_Y) + (16 / 116);
    }
    if (var_Z > 0.008856) {
        var_Z = Math.pow(var_Z, (1 / 3));
    } else {
        var_Z = (7.787 * var_Z) + (16 / 116);
    }

    CIE_L = (116 * var_Y) - 16;
    CIE_a = 500 * (var_X - var_Y);
    CIE_b = 200 * (var_Y - var_Z);

    return [CIE_L, CIE_a, CIE_b];
}

function bookDistance(book1, book2) {
    book1 = book1.getDominantColor();
    book2 = book2.getDominantColor();
    book1red = book1.substring(1, 3);
    book1red = parseInt(book1red, 16);
    book1green = book1.substring(3, 5);
    book1green = parseInt(book1green, 16);
    book1blue = book1.substring(5, 7);
    book1blue = parseInt(book1blue, 16);
    book2red = book2.substring(1, 3);
    book2red = parseInt(book2red, 16);
    book2green = book2.substring(3, 5);
    book2green = parseInt(book2green, 16);
    book2blue = book2.substring(5, 7);
    book2blue = parseInt(book2blue, 16);
    var book1xyz = RGBtoXYZ(book1red, book1green, book1blue);
    var book2xyz = RGBtoXYZ(book2red, book2green, book2blue);
    var book1lab = XYZtoLAB(book1xyz);
    var book2lab = XYZtoLAB(book2xyz);

    return Math.sqrt(Math.pow((book1lab[0] - book2lab[0]), 2) + Math.pow((book1lab[1] - book2lab[1]), 2) + Math.pow((book1lab[2] - book2lab[2]), 2));
}

function findNearest(bookArray, book1) {
    var nearestBook = 0;
    var curDistance = 1000000;
    var newBook = 0;
    var newDistance = 0;
    
    for (var j = 0; j < bookArray.length; j++) {
        newBook = j;
        newDistance = bookDistance(bookArray[j], book1);
        if (newDistance < curDistance) {
            nearestBook = j;
            curDistance = newDistance;
        }
    }
    
    return nearestBook;
}

function nearestNeighborVersion(bookArray) {
    var newBookArray = [];
    var book = 0;
    var loopMax = bookArray.length
    for (var i = 0; i < loopMax; i++) {

        if (i === 0) {
            newBookArray.push(bookArray.pop());
        } else {
            book = findNearest(bookArray, newBookArray[i - 1]);
            newBookArray.push(bookArray[book]);
            bookArray.splice(book, 1);

	}
    }
    return newBookArray;
}

// pixastic stuff
/*
var edges = new Image();

edges.onload = function() {
    Pixastic.process(edges, "edges", {mono:true,invert:true});
    Pixastic.process(edges, "sharpen", {amount :0.5} );
    Pixastic.process(edges, "removenoise");
}

document.body.appendChild(edges);
edges.src = "img/books1small.jpg";
*/

function Book() {
    var image = null;
    var dominantColor = null;
    var secondaryColor = null;
    var width = null;

    this.setImage = function(image) {
	this.image = image;
    };

    this.getImage = function() {
	return this.image;
    };

    this.setDominantColor = function(color) {
	this.dominantColor = color;
    };

    this.getDominantColor = function() {
	return this.dominantColor;
    };

    this.setSecondaryColor = function(color) {
	this.secondaryColor = color;
    };

    this.getSecondaryColor = function() {
	return this.secondaryColor;
    };

    this.setWidth = function(width) {
	this.width = width;
    };

    this.getWidth = function() {
	return this.width;
    }
}

var bookArray = [];
var rectangle = [];
var colorThief = new ColorThief();

function drawBooks(bookArray) {
    var cur_offset = 0;
    var y_offset = 60;
    var min_width = 60;
    sel_ctx.clearRect(0, 0, sel_ctx.canvas.width, sel_ctx.canvas.height);
    for(var i = 0; i < bookArray.length; i++)
    {
	var book = bookArray[i];
	var width = min_width;
	if(width < book.getWidth()) {
	    width = book.getWidth();
	}
	sel_ctx.beginPath();
	sel_ctx.fillStyle = book.getDominantColor();
	sel_ctx.rect((width-50)/2 + cur_offset, 0, 50, 50);
	sel_ctx.fill();
	sel_ctx.closePath(); 
	sel_ctx.drawImage(book.getImage(), 0 + cur_offset, 0 + y_offset)
	cur_offset += width + 10;
    }
}

// selected books aren't always vertical or selected in the same order
// this method takes any 4 points and returns the most left and top value
// for one point and the most right and lowest value for the other
function getCorners(rectangle) {
    var right = 0;
    var left = 100000;
    var bottom = 0;
    var top = 100000;
    
    for(var i = 0; i < rectangle.length; i++) {
	curPoint = rectangle[i];
	if(curPoint[0] > right) {
	    right = curPoint[0];
	}
	if(curPoint[0] < left) {
	    left = curPoint[0];
	}
	if(curPoint[1] > bottom) {
	    bottom = curPoint[1];
	}
	if(curPoint[1] < top) {
	    top = curPoint[1];
	}
    }
    return [[left, top],[right,bottom]];
} 

function sliceImage(rectangle) {
    var tempCanvas = document.createElement('canvas');
    tempCtx = tempCanvas.getContext('2d')
    var corner = getCorners(rectangle);
    tempCtx.canvas.width = corner[1][0] - corner[0][0];
    tempCtx.canvas.height = corner[1][1] - corner[0][1];
    tempCtx.drawImage(canvas, corner[0][0], corner[0][1], corner[1][0] - corner[0][0], corner[1][1] - corner[0][1], 0, 0,  corner[1][0] - corner[0][0], corner[1][1] - corner[0][1]);
    var image = document.createElement('img');
    image.src = tempCanvas.toDataURL();
    image.width = tempCtx.canvas.width;
    image.height = tempCtx.canvas.height;
    var palette = colorThief.getPalette(image, 10, 2); // this seems to be terrible
    palette = colorThief.getColor(image);
    newBook = new Book();
    newBook.setImage(image);
    newBook.setWidth(tempCtx.canvas.width);
    newBook.setDominantColor(rgbToHex(palette[0], palette[1], palette[2]));
    newBook.setSecondaryColor(rgbToHex(palette[0], palette[1], palette[2]));
    bookArray.push(newBook);
    bookArray = nearestNeighborVersion(bookArray);
    drawBooks(bookArray);
}

$("#the_canvas").ready(function() {
    $('#the_canvas').click(function(e) {
	var posX = e.pageX - $(this).position().left;
	var posY = e.pageY - $(this).position().top;
	ctx.fillStyle="#FFFFFF";
	ctx.strokeStyle="#FFFFFF";
	ctx.arc(posX, posY, 3, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	rectangle.push([posX, posY]);
	if(rectangle.length === 2) {
	    ctx.beginPath()
	    ctx.moveTo(rectangle[0][0], rectangle[0][1]);
	    ctx.lineTo(rectangle[1][0], rectangle[1][1]);
	    ctx.closePath();
	    ctx.stroke();
	}
	if(rectangle.length === 3) {
	    ctx.beginPath()
	    ctx.moveTo(rectangle[1][0], rectangle[1][1]);
	    ctx.lineTo(rectangle[2][0], rectangle[2][1]);
	    ctx.closePath();
	    ctx.stroke();
	}
	if(rectangle.length === 4) {
	    ctx.beginPath()
	    ctx.moveTo(rectangle[2][0], rectangle[2][1]);
	    ctx.lineTo(rectangle[3][0], rectangle[3][1]);
	    ctx.closePath();
	    ctx.stroke();
	    ctx.beginPath()
	    ctx.moveTo(rectangle[3][0], rectangle[3][1]);
	    ctx.lineTo(rectangle[0][0], rectangle[0][1]);
	    ctx.closePath();
	    ctx.stroke();
	    ctx.drawImage(img,0,0);
	    sliceImage(rectangle);
	    rectangle=[];
	}
    });
});


var canvas = document.getElementById("the_canvas");
var ctx = canvas.getContext("2d");
var selected = document.getElementById("selected");
var sel_ctx = selected.getContext("2d");
// var img = document.getElementById("book");
var img = document.createElement("img");
img.src = "img/gold.jpg";
ctx.drawImage(img,0,0);
