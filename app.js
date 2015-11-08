let express = require('express');
let app = express();
let compression = require('compression'),
    bodyParser = require('body-parser');

app.use(compression());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/api', require('./server/routes/github.js')());

var port = 8080;
app.listen(port);
console.log('Express server started on port %s', port);
