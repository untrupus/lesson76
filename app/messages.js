const express = require('express');
const router = express.Router();
const fs = require('fs');
const {nanoid} = require('nanoid');

router.get('/', (req, res) => {
    const fileName = './messages/messages.txt';
    if (req.query.datetime) {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                console.error(err);
            }
            let index = JSON.parse(data).map(e => {
                return e.datetime;
            }).indexOf(req.query.datetime);
            res.send(JSON.parse(data).splice(0, JSON.parse(data).length - (index + 1)));
        });
    } else {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                console.error(err);
            }
            if (JSON.parse(data).length <= 30) {
                res.send(JSON.parse(data));
            } else {
                res.send(JSON.parse(data).slice((JSON.parse(data).length - 30), JSON.parse(data).length));
            }

        });
    }
});

router.post('/', (req, res) => {
    const message = req.body;
    if (message.author === '' || message.message === '') {
        res.status(400).send({"error": "Author and message must be present in the request"});
    } else {
        message.datetime = new Date().toJSON();
        message.id = nanoid();
        const fileName = './messages/messages.txt';
        fs.readFile(fileName, (err, data) => {
            if (err) {
                console.error(err);
            }
            let newData = (JSON.parse(data));
            newData.push(message);
            fs.writeFileSync(fileName, JSON.stringify(newData));
        });
        res.send(console.log('success'));
    }
});

module.exports = router;