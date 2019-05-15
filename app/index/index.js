var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var apiHelper = require("../common/api-helper");
var config = require("../config/config");


/* 入口 */
router.get('/*', function(req, res, next) {
    res.render('../dist/view/index.html');
});

module.exports = router;
