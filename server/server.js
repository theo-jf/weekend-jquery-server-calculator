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
    let numbers = req.body.equationString.split(/['+''sub''x''÷']+/);
    let operators = req.body.equationString.split(/[-\d]+/);
    // Remove hanging dots and fill calculationHistory
    operators = operators.filter(element => {
        return (element === '' || element === '.') ? false : true;
    });
    let refinedCalculation = [];
    let j = 0;
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i].charAt(numbers[i].length - 1) === '.') {
            numbers[i] = numbers[i].slice(0, -1);
            refinedCalculation.push(numbers[i]);
        } else {
            refinedCalculation.push(numbers[i]);
        }
        while (j < operators.length) {
            operators[j] = operators[j].replace(/['.']/g, '');
            refinedCalculation.push(operators[j]);
            j++;
            break;
        }
    }
    refinedCalculation = refinedCalculation.join('');
    console.log(refinedCalculation);
    calculationHistory.calculations.push(refinedCalculation);
    let answer = 0;
    let i = 0;
    for (let number of numbers) {
        if (i === 0) {
            answer = Number(number);
            i++;
        } else {
            switch (operators[i - 1])
            {
                case '+':
                    answer += Number(number);
                    break;
                case 'sub':
                    answer -= Number(number);
                    break;
                case 'x':
                    answer *= Number(number);
                    break;
                case '÷':
                    answer /= Number(number);
                    break;
            }
            i++;
        }
    }
    calculationHistory.answers.push(answer);
    res.sendStatus(202);
})

app.get('/function', (req, res) => {
    res.send(String(calculationHistory.answers[calculationHistory.answers.length - 1]));
})

app.get('/history', (req, res) => {
    res.send(calculationHistory);
})




app.listen(PORT, () => {
    console.log('listening on port', PORT)
});