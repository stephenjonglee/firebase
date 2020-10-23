const { backedUpFiles } = require('./fresh');
const db = require('diskdb');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

// lowercaseOrder function will make all the orders in lowercase for the database for easier matching.
function lowercaseOrder(obj) {
    return {
        coffee: obj.coffee.toLowerCase(),
        emailAddress: obj.emailAddress.toLowerCase(),
        flavor: obj.flavor.toLowerCase(),
        strength: parseInt(obj.strength),
        size: obj.flavor.toLowerCase(),
        _id: obj._id
    };
}

// all orders
app.get('/coffeeorders', (req, res) => {
    db.connect('./data', ['coffeeorders']);
    res.json(db.coffeeorders.find());
});

app.post('/coffeeorders', (req, res) => {
    db.connect('./data', ['coffeeorders']);
    try {
        console.log(req.body);
        db.coffeeorders.save(lowercaseOrder(req.body));
        res.sendStatus(201);
    } catch (e) {
        console.log(`API error: ${e}`);
        res.sendStatus(500);
    }
});

app.delete('/coffeeorders', (req, res) => {
    db.connect('./data', ['coffeeorders']);
    backedUpFiles()
        .then(() => {
            res.sendStatus(200);
        });
});

// email routes.
app.get('/coffeeorders/:emailAddress', (req, res) => {
    const emailAddress = req.params.emailAddress ? req.params.emailAddress.toLowerCase() : undefined;
    console.log(`looking for: ${emailAddress}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.find( { emailAddress: emailAddress } );
    if (record) res.status(200).json(record);
    else res.sendStatus(404);
});

app.put('/coffeeorders/:emailAddress', (req, res) => {
    const emailAddress = req.params.emailAddress ? req.params.emailAddress.toLowerCase() : undefined ;
    console.log(`looking for: ${emailAddress}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.findOne( { emailAddress: emailAddress } );
    console.log(`PUT: ${JSON.stringify(record,null,2)}`);
    if (record) {
        try {
            req.body._id = record._id;
            db.coffeeorders.remove({ _id: record._id });
            setTimeout(() => {
                db.coffeeorders.save(req.body);
                res.status(200).json(req.body);
            }, 200);
        } catch (e) {
            res.status(500).json({"error": `${e}`});
        }
    }
    else res.sendStatus(404);
});

app.delete('/coffeeorders/:emailAddress', (req, res) => {
    const emailAddress = req.params.emailAddress.toLowerCase();
    console.log(`looking for: ${emailAddress}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.findOne( { emailAddress: emailAddress } );
    if (record) {
        db.coffeeorders.remove( { _id: record._id }, false );
        res.sendStatus(200);
    }
    else res.sendStatus(404);
});

// coffee type orders
app.get('/coffeeorders/coffee/:coffee', (req, res) => {
    const coffee = req.params.coffee.toLowerCase();
    console.log(`looking for: ${coffee}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.find( { coffee: coffee } );
    if (record) res.status(200).json(record);
    else res.sendStatus(404);
});

app.delete('/coffeeorders/coffee/:coffee', (req, res) => {
    const coffee = req.params.coffee.toLowerCase();
    console.log(`looking for: ${coffee}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.find( { coffee: coffee } );
    console.log(`record: ${JSON.stringify(record)}`);
    if (record) {
        db.coffeeorders.remove( { _id: order._id }, false );
        res.sendStatus(200);
    }
    else res.sendStatus(404);
});

// flavor orders
app.get('/coffeeorders/flavor/:flavor', (req, res) => {
    const flavor = req.params.flavor.toLowerCase();
    console.log(`looking for: ${flavor}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.find( { flavor: flavor } );
    if (record) res.status(200).json(record);
    else res.sendStatus(404);
});

app.delete('/coffeeorders/flavor/:flavor', (req, res) => {
    const flavor = req.params.flavor.toLowerCase();
    console.log(`looking for: ${flavor}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.find( { flavor: flavor } );
    console.log(`deleting flavors: ${JSON.stringify(record)}`);
    if (record) {
        db.coffeeorders.remove( { flavor: flavor }, true );
        res.sendStatus(200);
    }
    else res.sendStatus(404);
});

// strength orders
app.get('/coffeeorders/strength/:strength', (req, res) => {
    const strength = parseInt(req.params.strength);
    if(!strength) {
        res.sendStatus(404);
    }
    console.log(`looking for: ${strength}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.find( { strength: strength } );
    if (record) res.status(200).json(record);
    else res.sendStatus(404);
});

app.delete('/coffeeorders/strength/:strength', (req, res) => {
    const strength = parseInt(req.params.strength);
    if(!strength) {
        res.sendStatus(404);
    }
    console.log(`looking for: ${strength}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.find( { strength: strength } );
    console.log(`record: ${JSON.stringify(record)}`);
    if (record) {
        db.coffeeorders.remove( { _id: order._id }, true );
        
        res.sendStatus(200);
    }
    else res.sendStatus(404);
});

// size orders
app.get('/coffeeorders/size/:size', (req, res) => {
    const size = req.params.size.toLowerCase();
    console.log(`looking for: ${size}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.find( { size: size } );
    if (record) res.status(200).json(record);
    else res.sendStatus(404);
});

app.delete('/coffeeorders/size/:size', (req, res) => {
    const size = req.params.size.toLowerCase();
    console.log(`looking for: ${size}`);
    db.connect('./data', ['coffeeorders']);
    let record = db.coffeeorders.find( { size: size } );
    console.log(`deleting flavors: ${JSON.stringify(record)}`);
    if (record) {
        db.coffeeorders.remove( { size: size }, true );
        res.sendStatus(200);
    }
    else res.sendStatus(404);
});

app.listen(3000);