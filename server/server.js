let calculationHistory =  {
    calculations: [],
    answers: []

};

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/function', (req, res) => {
    calculationHistory.calculations.push(req.body);
    let math = req.body.split('+'|'-'|'x'|'÷');
    console.log(math);
})




app.listen(PORT, () => {
    console.log('listening on port', PORT)
});