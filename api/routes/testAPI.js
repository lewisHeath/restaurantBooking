let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.send("API is working!");
});

module.exports = router;