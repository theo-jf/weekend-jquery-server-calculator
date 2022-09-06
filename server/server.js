let calculationHistory =  {
    calculations: [],
    answers: []
};

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/function', (req, res) => {
    let numbers = req.body.equationString.split(/['+''sub''x''÷']+/);
    let operators = req.body.equationString.split(/[-\d]+/);
    console.log(numbers);
    console.log(operators);

    // Remove hanging dots and fill calculationHistory
    operators = operators.filter(element => {
        return (element === '' || element === '.') ? false : true;
    });
    let refinedCalculation = [];
    let j = 0;
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i].charAt(numbers[i].length - 1) === '.') {
            numbers[i] = numbers[i].slice(0, -1);
            if (numbers[i] === '') {
                numbers[i] = '0';
                console.log(0);
            }
            refinedCalculation.push(numbers[i]);
        } else {
            if (numbers[i] === '') {
                numbers[i] = '0';
                console.log(0);
            }
            refinedCalculation.push(numbers[i]);
        }
        while (j < operators.length) {
            operators[j] = operators[j].replace(/['.']/g, '');
            refinedCalculation.push(operators[j]);
            j++;
            break;
        }
    }

    console.log(refinedCalculation);

    // Remove accidental double operators stored
    for (let i = 0; i < refinedCalculation.length; i++) {
        if (refinedCalculation[i][0] === 'x') {
            refinedCalculation[i] = 'x';
        } else if (refinedCalculation[i][0] === '+') {
            refinedCalculation[i] = '+';
        } else if (refinedCalculation[i][0] === 's') {
            refinedCalculation[i] = 'sub';
        } else if (refinedCalculation[i][0] === '÷') {
            refinedCalculation[i] = '÷';
        }
    }

    refinedCalculation = refinedCalculation.join('');
    if (refinedCalculation === '') {
        calculationHistory.calculations.push('0');
    } else {
        calculationHistory.calculations.push(refinedCalculation);
    }

    console.log(refinedCalculation);

    // Order of operations -> Swap operator order and inverse equation if subtraction
    if (operators[1] === 'x' || operators[1] === '÷') {
        if (operators[0] === '+') {
            operators.reverse();
            let numberToSwap = numbers.shift();
            numbers.push(numberToSwap);
        } else if (operators[0] === 'sub') {
            operators.reverse();
            let numberToSwap = '-' + numbers.shift();
            numbers.push(numberToSwap);
            numbers[0] = '-' + numbers[0]; 
        }
    }
    console.log(numbers);
    console.log(operators);

    // Calculate function
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

app.delete('/reset', (req, res) => {
    calculationHistory.calculations = [];
    calculationHistory.answers = [];
    res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});