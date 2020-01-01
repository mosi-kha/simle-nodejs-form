const express = require("express");
const mongoose = require('mongoose');
const morgan = require('morgan');
const persianDate = require('persian-date');
const Schema = mongoose.Schema;


// connect to mongodb
mongoose.connect('mongodb://localhost:27017/formDB', { useNewUrlParser: true, useUnifiedTopology: true });
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
}
);

let Form = mongoose.model('Form', FormSchema);

//rest API
let app = express();
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.json());
app.use(express.static('./public'));
app.use(express.urlencoded());

let form = mongoose.model('Form', FormSchema);

app.post('/', (req, res) => {
    let _name = req.body.name;
    let _address = req.body.address;
    let _date = req.body.date;

    // let _p_date = new persianDate(_date);
    // persianDate().isPersianDate(_p_date());

    var form = new Form(({
        name: _name,
        address: _address,
        date: _date

    }));

    form.save(function (err, form) {
        if (err) throw err;
        console.log("Record inserted Successfully");

    });

    return res.redirect('index.html');
});

app.get('/forms', (req, res) => {
    Form.find({}, (err, forms) => {
        let formMap = [];

        forms.forEach((form) => {
            formMap.push(form);
        });
        res.send(formMap);
    });
});

app.listen(3000, () => {
    console.log("server listening at port 3000");
});
