var express = require('express')
var router = express.Router()

var api = require('../ops/parseData')
var seshApi = require('../ops/parseSession')
var user = require('./user');

// define the home page route
router.get('/', function (req, res) {
    res.redirect('/auth/login')
})


router.get('/registration', function (req, res) {
    res.render('main', {layout: 'index', partial: 'authForm', data: {list: ["Username", "password", "Confirm-password"], name: "Signup"}});
})

router.get('/login', function (req, res) {
    res.render('main', {layout: 'index', partial: 'authForm', data: {list: ["Username", "password"], name: "Login", error: ""}});
})

router.get('/checkNames/:name', function (req, res) {
    res.send(api.checkNames({name: req.params.name}))
})

router.post('/login', function (req, res) {
    var result =  req.body
    result['name'] = result.Username
    delete result.Username

    var data = api.findUser(result);
    if(data !== undefined){
        seshApi.editSession(data)
        res.redirect('/user')
    }else{
        res.render('main', {layout: 'index', partial: 'authForm', data: {list: ["Username", "password"], name: "Login", error: "Username or Password is incorrect"}});
    }
});

router.post('/registration', function (req, res) {
    var parsedRes = {}
    parsedRes['name'] = req.body.Username;
    parsedRes['password'] = req.body.password;
    api.addUser(parsedRes);
    res.redirect("/auth/login")
});

router.use('/user', user);


module.exports = router