
//Loads the express and handlebars modules
const express = require('express');
const handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var seshApi = require('./ops/parseSession')
const api = require('./ops/parseData');


//Route modules
var auth = require('./routes/auth')
var user = require('./routes/user');

//Creates our express server
const app = express();
const port = 3000;


//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');

//Set handlebars configurations
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials/',

}))


//Serves static files (we need it to import a css file)
app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/public')); // redirect chart js library

/************************************* */
//body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


/************************************* */
var hbs = handlebars.create({});
hbs.handlebars.registerHelper('whichPartial', function(context, options) { return context });

// 1. Define a helper.
// http://handlebarsjs.com/expressions.html#helpers


// also note: Helpers receive the current context as the this context of the function.
hbs.handlebars.registerHelper('link', function(object) {
    return new Handlebars.SafeString(
      "<a href='" + object.url + "'>" + object.text + "</a>"
    );
  });
  
hbs.handlebars.registerHelper('link', function(text, options) {
var attrs = [];
for(var prop in options.hash) {
    attrs.push(prop + '="' + options.hash[prop] + '"');
}
return new hbs.handlebars.SafeString(
    "<a " + attrs.join(" ") + ">" + text + "</a>"
);
});

hbs.handlebars.registerHelper('isDescription', function (value) {

    return value === "Description";
});

hbs.handlebars.registerHelper('is_description', function (value) {

    return value === "description";
});

hbs.handlebars.registerHelper('isNames', function (value) {
    return value === "Names";
});

hbs.handlebars.registerHelper('isHobbyId', function (value) {
    return value === "hobbyId";
});

hbs.handlebars.registerHelper('isPass', function (value) {
    if(value === "password" || value === "Confirm-password"){
        return true
    }
    return false
});

hbs.handlebars.registerHelper('loggedIn', function () {
    if(seshApi.getSessionInfo().id){
        return true;
    }
    return false;
});

hbs.handlebars.registerHelper('isLoggedIn', function () {
    if(seshApi.getSessionInfo().name){
        return new hbs.handlebars.SafeString('<div class=" login-link text-light">'+ seshApi.getSessionInfo().name +'</div>');
    }else{
        return new hbs.handlebars.SafeString('<span class="px-2 py-1 login-link text-light">' + 'Not logged in? '+ "<a href='" + "/auth" + "' class='" + "nav-link d-inline text-light" + "'>" + "login" + "</a>" +'</span>')
    }
});

hbs.handlebars.registerHelper('hasError', function (error) {
    if(error !== ""){
        return true
    }
    return false
});




/****GET OPERATIONS********************************* */
//Sets a basic route
app.get('/', (req, res) => {
    res.redirect('/welcome');
});

app.get('/welcome', (req, res) => {
    res.render('main', {layout : 'index', partial: 'welcome'});
});

app.get('/members', (req, res) => {
    res.render('main', {layout : 'index', partial: 'members'});
});


app.get('/data/:id/:hobbyId', (req, res)=> {
    var data = api.parseToChartData(api.getUserHobbyInfo(req.params.id, req.params.hobbyId));// subject to change
    res.send(data);
})

app.get('/data/donutChart', (req, res)=> {
    var data = api.makeDonutChart(seshApi.getSessionInfo().id)
    res.send(data);
})

app.use('/auth', auth);
app.use('/user', user);

app.get('*', (req, res)=> {
    res.redirect('/welcome');
})




//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

module.exports = app;