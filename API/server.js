// Server setup
// =============================================================================
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:welcome@jello.modulusmongo.net:27017/ob4ymyWa');
var User = require('./models/user');

// ROUTES
// =============================================================================
var router = express.Router();

// Middleware
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('Request received.');
    next();
});

// Testing route
router.get('/', function(req, res) {
    res.json({
        message: 'It works!'
    });
});

// Routes for /users
// ----------------------------------------------------
router.route('/users')

//GET http://localhost:8080/api/users
.get(function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.send(err);
        }
        res.json(users);
    });
})

// POST http://localhost:8080/users
.post(function(req, res) {
    var user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.city = req.body.city;

    user.save(function(err) {
        if (err) {
            res.send(err);
        }
        res.json({
            message: 'User created!'
        });
    });
});

// Routes for /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

//GET http://localhost:8080/api/users/1
.get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
})

//PUT http://localhost:8080/api/users/1
.put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        }

        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.city = req.body.city;

        user.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'User updated!'
            });
        });
    });
})

//DELETE http://localhost:8080/api/users/1
.delete(function(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err) {
            res.send(err);
        }
        res.json({
            message: 'User successfully deleted'
        });
    });
});

app.use('/api', router);

// =============================================================================
app.listen(port);
console.log('Server succesfully started on port ' + port);
