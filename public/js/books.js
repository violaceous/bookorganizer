
var myCanvas = document.getElementById('my_canvas_id');
var ctx = myCanvas.getContext('2d');

function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}


$(document).ready(function () {

var colorThief = new ColorThief();
var myImage = $('#book');

    myImage[0].click(function(e) {
	var offset = $(this).offset();
	alert(e.clientX - offset.left);
	alert(e.clientY - offset.top);
    });


    var color = colorThief.getColor(myImage[0], 3);
		  var colorcode = "#" + rgbToHex(color[0], color[1], color[2]);
		  ctx.fillStyle=colorcode;
		  ctx.fillRect(0,0,100,100);

    ctx.drawImage(myImage[0], 1000, 1000, 200, 200, 0, 0, 200, 200);
    var image = myCanvas.toDataURL();
    document.getElementById('goeshere').src = image;
    document.getElementById('goeshere').width = "200";
    document.getElementById('goeshere').height = "200";
    var myImage = $('#goeshere');
    alert(myImage[0]);
    alert(colorThief.getColor(myImage[0]));

});