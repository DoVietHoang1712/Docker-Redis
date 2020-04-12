const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(req.session);
    res.render('index.ejs', {name: 'hoang'});
});

module.exports = router;