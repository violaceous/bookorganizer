function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
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
    sel_ctx.clearRect(0, 0, sel_ctx.canvas.width, sel_ctx.canvas.height);
    for(var i = 0; i < bookArray.length; i++)
    {
	var book = bookArray[i];
	sel_ctx.drawImage(book.getImage(), 0 + cur_offset, 0)
	cur_offset += book.getWidth();
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
	} else if(curPoint[0] < left) {
	    left = curPoint[0];
	}
	if(curPoint[1] > bottom) {
	    bottom = curPoint[1];
	} else if(curPoint[1] < top) {
	    top = curPoint[1];
	}
    }
    return [[left, top],[right,bottom]];
} 

function sliceImage(rectangle) {
    var tempCanvas = document.createElement('canvas');
    tempCtx = tempCanvas.getContext('2d')
    var corners = getCorners(rectangle);
    tempCtx.canvas.height = rectangle[2][1] - rectangle[0][1];
    tempCtx.drawImage(canvas, rectangle[0][0], rectangle[0][1], rectangle[2][0] - rectangle[0][0], rectangle[2][1] - rectangle[0][1], 0, 0,  rectangle[2][0] - rectangle[0][0], rectangle[2][1] - rectangle[0][1]);
    var image = document.createElement('img');
    image.src = tempCanvas.toDataURL();
    image.width = tempCtx.canvas.width;
    image.height = tempCtx.canvas.height;
    var palette = colorThief.getPalette(image, 2, 5);
    newBook = new Book();
    newBook.setImage(image);
    newBook.setWidth(tempCtx.canvas.width);
    newBook.setDominantColor(rgbToHex(palette[0][0], palette[0],[1], palette[0],[2]));
    newBook.setSecondaryColor(rgbToHex(palette[1][0], palette[1],[1], palette[1],[2]));
    bookArray.push(newBook);
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
	    sliceImage(rectangle);
	    rectangle=[];
	}
    });
});


var canvas = document.getElementById("the_canvas");
var ctx = canvas.getContext("2d");
var selected = document.getElementById("selected");
var sel_ctx = selected.getContext("2d");
var img = document.getElementById("book");
ctx.drawImage(img,0,0);
