const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index.ejs', {name: 'hoang'});
});

module.exports = router;