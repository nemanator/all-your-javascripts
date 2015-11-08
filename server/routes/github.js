let express = require('express');
let router = express.Router();
let Github = require('../modules/github');

router.get('/github/user/:user', function (req, res) {
    let user = req.params.user;
    let gh = new Github(user);

    gh.getAllInfo()
        .then(function (out) {
        res.json(out);
    }).catch(function(e) {
        res.status(422).json(e);
    });
});

router.get('/test', function (req, res) {
    res.json('test');

});

module.exports = () => {
    return router;
};