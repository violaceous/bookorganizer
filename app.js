var express = require('express');
var app = express();
app.configure(function(){
	app.use('/public', express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/public'));
});


app.listen(process.env.PORT || 3000);
