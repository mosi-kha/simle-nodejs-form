const express = require("express");
const mongoose = require('mongoose');
const morgan = require('morgan');
const Schema = mongoose.Schema;


// connect to mongodb
mongoose.connect('mongodb://localhost:27017/formDB', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
});

//create db model
let FormSchema = new Schema({
        address: String,
        name: String,
        date: String,
        email: String
    }
);

let Form = mongoose.model('Form', FormSchema);

//rest API
let app = express();
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.json());
app.use(express.static('./public'));
app.use(express.urlencoded());
app.set('view engine', 'ejs');

function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

app.post('/', (req, res) => {
    let _name = req.body.name;
    let _address = req.body.address;
    let _date = req.body.date;
    let _email = req.body.email;

    if (_name === '' || _address === '' || _address === '') {
        return res.status(404).send(
            "Empty Field!\nPlease Try Again!"
        );

    } else if (!validateEmail(_email)) {
        return res.status(422).send(
            "Invalid Email!\nPlease Try Again!"
        );
    }


    const form = new Form(({
        address: _address,
        date: _date,
        email: _email,
        name: _name,

    }));

    form.save(function (err, form) {
        if (err) throw err;
        console.log("Record inserted Successfully");

    });

    res.send(200);
    res.end();
    // return res.redirect('index.html');
});

app.get('/forms', (req, res) => {
    let query = {};
    if (req.query.search || req.query.search === '') {
        let searchParam = req.query.search;
        query = {
            $or: [{name: {$regex: '^' + searchParam}},
                {email: {$regex: '^' + searchParam}},
                {address: {$regex: '^' + searchParam}}]
        };
        Form.find(query, (err, forms) => {
            let formMap = [];
            try {
                forms.forEach((form) => {
                    formMap.push(form);
                });
                res.render('list', {data: formMap});
            } catch (e) {
                console.log(e);
            }

        });
    } else
        Form.find({}, (err, forms) => {
            let formMap = [];

            forms.forEach((form) => {
                formMap.push(form);
            });
            res.render('forms', {data: formMap});
        });
});

app.listen(3000, () => {
    console.log("server listening at port 3000");
});
