
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

var rectangle = [];

function sliceImage(rectangle) {
    sel_ctx.drawImage(canvas, rectangle[0][0], rectangle[0][1], rectangle[2][0] - rectangle[0][0], rectangle[2][1] - rectangle[0][1], 0, 0,  rectangle[2][0] - rectangle[0][0], rectangle[2][1] - rectangle[0][1]);
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
