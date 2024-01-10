var express = require('express')
var router = express.Router();

var api = require('../ops/parseData');
var seshApi = require('../ops/parseSession');


// **********GET OPERATIONS*****************************************************************************************
// define the home page route
router.get('/', function (req, res) {
    res.redirect('/user/dashboard')
  
})

router.get('/dashboard', function (req, res) {
    res.render('main', {layout: 'index', partial: 'dashboard', data: api.getUserHobbies(seshApi.getSessionInfo().id)});
});

router.get('/edit', function (req, res) {
    res.render('main', {layout: 'index', partial: 'editUser', data: api.getUserData(seshApi.getSessionInfo().id), type: "save"});
});

router.get('/logout', function (req, res) {
    seshApi.clearSessionInfo();
    res.redirect('/welcome');
});


router.get('/hobby/add', function (req, res) {
    res.render('main', {layout: 'index', partial: 'addHobby', data: ["Hobby", "Description", "Ideal time"], type: "create" });
});

router.get('/hobby/:hobbyId', function (req, res) {
    res.render('main', {layout: 'index', partial: 'hobby', userId: seshApi.getSessionInfo().id, data: api.getUserHobby(seshApi.getSessionInfo().id, req.params.hobbyId)});
});

router.get('/hobby/:hobbyId/edit', function (req, res) {
    res.render('main', {layout: 'index', partial: 'editHobby', data: api.getUserHobby(seshApi.getSessionInfo().id, req.params.hobbyId), type: "save"});
});

router.get('/hobby/:hobbyId/time/add', function (req, res) {
    res.render('main', {layout: 'index', partial: 'addTime', type: "add"});
});

//****POST OPERATIONS**************************************************************************** */
router.post('/hobby/:hobbyId/edit', function (req, res) {
    api.editHobbyData(seshApi.getSessionInfo().id ,req.body);
    res.redirect(`/user/hobby/${req.params.hobbyId}`);
});

router.post('/hobby/add', function (req, res) {
    var parsedRes = {}
    parsedRes['hobby'] = req.body.Hobby
    parsedRes['description'] = req.body.Description
    parsedRes['idealTime'] = req.body['Ideal time']

    api.addHobby(seshApi.getSessionInfo().id, parsedRes);
    res.redirect(`/user/dashboard`)
});


router.post('/hobby/:hobbyId', function (req, res) {
    api.removeHobby(seshApi.getSessionInfo().id, req.params.hobbyId)
    res.redirect(`/user/dashboard`);
});

router.post('/edit', function (req, res) {
    var data = api.getUserData(seshApi.getSessionInfo().id)
    var keys = Object.keys(data);
    var changed = false;

    for(idx=0; idx<keys.length; idx++){
        if(req.body[keys[idx]] == data[keys[idx]]){
            continue;
        }else{
            changed = true;
            break;
        }
    }

    if(changed){
        api.editUserData(seshApi.getSessionInfo().id, req.body)
        res.redirect('/welcome');
    }else{
        res.redirect('/user/dashboard');
    }
    
});

router.post('/hobby/:hobbyId/time/add', function (req, res) {
    api.addTimeToHobby(seshApi.getSessionInfo().id, {hobbyId: req.params.hobbyId, timeSegment: req.body.timeSegment});
    res.redirect(`/user/hobby/${req.params.hobbyId}`);
});

module.exports = router
