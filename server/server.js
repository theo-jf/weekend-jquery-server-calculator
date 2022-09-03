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
    calculationHistory.calculations.push(req.body.equationString);
    console.log(calculationHistory.calculations[calculationHistory.calculations.length - 1]);
    let numbers = calculationHistory.calculations[calculationHistory.calculations.length - 1].split(/['+''sub''x''÷']+/);
    let operators = calculationHistory.calculations[calculationHistory.calculations.length - 1].split(/[-\d]+/);
    operators = operators.filter(element => {
        return (element === '' || element === '.') ? false : true;
    });
    console.log(numbers);
    console.log(operators);
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