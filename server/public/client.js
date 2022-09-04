let doubleOperator = false;
let operatorCount = 0;
let doubleDecimal = false;
let doubleNumber = false;
let numberCount = 0;
let answerOnDisplay = true;
let equationString = '';
let operatorCarryOver = [];

$(readyNow);

function readyNow() {

    // Delete server-stored history on page load
    displayHistory();

    // Listener for #equals --> post request to server
    $('#equals').on('click', submitEquation);

    // Listeners for numbers
    $('#calculator').on('click', '.button', appendDisplay);

    // Clear button listener
    $('#clear').on('click', clear);

    // listener on entire table for click on history to re-run calculation
    $('#historyTable').on('click', '.history', redoCalculation);

    $('#clearHistory').on('click', clearHistory);
}

function submitEquation() {
    numberCount = 0;
    if (equationString === '' && doubleOperator === true) {
        equationString = '0';
    }
    else if (!isNaN(equationString.charAt(equationString.length - 1))) {
        equationString += $('#display').text();
        console.log("1")
    } else {
        if (doubleNumber === true) {
            equationString += $('#display').text();
            console.log("2")
        } else {
            console.log('To remove:', equationString.charAt(equationString.length - 1));
            if (equationString.charAt(equationString.length - 1) === 'b') {
                equationString = equationString.slice(0, -3);
                console.log('sus');
            } else {
                console.log('before error', equationString);
                equationString = equationString.slice(0, -1);
            }
            console.log(equationString);
        }
    }
    console.log('equation string:', equationString);
    $.ajax({
        type: 'POST',
        url: '/function',
        data: {equationString}
    }).then(function(response) {
        console.log(response);
        equationString = '';
        getAnswer();
    });
}

function appendDisplay() {
    $('#clear').text('C');
    let symbol = String($(this).text());
    let buttonType = $(this).attr('class').split(' ')[1];
    if (buttonType === 'number') {
        numberCount++;
        if (numberCount < 17) {
            if (answerOnDisplay === true || doubleOperator === true || ($('#display').text() === '0' && symbol != '0')) {
                $('#display').text('');
                answerOnDisplay = false;
            } else if ($('#display').text() === '-0') {
                $('#display').text('-');
            }
            $('#display').append(`${symbol}`);
            doubleNumber = true;
            doubleOperator = false;
        }
    } else if (buttonType === 'decimal') {
        if (answerOnDisplay === true || doubleOperator === true) {
            $('#display').text('');
            $('#display').text('0');
            answerOnDisplay = false;
            doubleOperator = false;
        }
        if (doubleDecimal === false) {
            $('#display').append(`${symbol}`);
            doubleDecimal = true;
        }
    } else if (buttonType === 'operator') {
        operatorCount++;
        numberCount = 0;
        doubleDecimal = false;
        if (doubleOperator === false) {
            if (answerOnDisplay === true || doubleNumber === true && operatorCount <= 2) {
                // If operation on answer from equation history
                equationString += $('#display').text();
                doubleOperator = true;
                doubleNumber = false;
            } else if (answerOnDisplay === false && doubleNumber === true && operatorCount > 2) {  
                if ($(this).attr('id') === 'subtract') {
                    operatorCarryOver.push('sub');
                    submitEquation();
                } else {
                    operatorCarryOver.push(symbol);
                    submitEquation();
                }
            }
        } else if (doubleOperator === true){
            if (equationString.charAt(equationString.length - 1) === 'b') {
                equationString = equationString.slice(0, -3);
                console.log('sus');
            } else {
                equationString = equationString.slice(0, -1);
            }
            operatorCount--;
            doubleOperator = true;
        } 
        if ($(this).attr('id') === 'subtract') {
            equationString += 'sub';
        } else {
            equationString += symbol;
        } 
        doubleOperator = true;
    } else if (buttonType === 'number' && doubleOperator === true) {
        // clear the display
        $('#display').text('');
        $('#display').append(`${symbol}`);
        numberCount++;
    } else if (buttonType === 'posNeg') {
        if (doubleOperator === true) {
            $('#display').text('');
        }
        if (Array.from($('#display').text())[0] === '-') {
            let numberString = $('#display').text();
            numberString = numberString.slice(1);
            $('#display').text('');
            $('#display').append(numberString);
        } else {
            $('#display').prepend(`${'-'}`);
        }
        answerOnDisplay = false;
    }
}

function clear() {
    numberCount = 0;
    doubleDecimal = false;
    if ($(this).text() === 'C') {
        console.log('state:', equationString);
        // let placeholder = equationString.replace(/['+''sub''x''÷']+/, '');
        if (doubleOperator === true) {
            $('#display').text('0');
            // $('#display').text(placeholder);
        // } else if (placeholder.charAt(placeholder.length - 1) === '.') {
        //     placeholder = placeholder.replace(/[.]+$/, '');
        //     console.log(placeholder);
        //     $('#display').text(placeholder);
        //     console.log('hey')
        } else {
            $('#display').text('0')
        }
        $('#clear').text('AC');
        answerOnDisplay = true;
    } else if ($(this).text() === 'AC') {
        $('#display').text('0');
        doubleOperator = false;
        operatorCount = 0;
        doubleDecimal = false;
        doubleNumber = false;
        answerOnDisplay = true;
        equationString = '';
        operatorCarryOver = [];
    }
}

function getAnswer() {
    $.ajax({
        type: 'GET',
        url: '/function'
    }).then(function(response) {
        $('#display').text('');
        $('#display').append(response);
        console.log('response', response);
        doubleOperator = false;
        doubleDecimal = false;
        doubleNumber = false;
        answerOnDisplay = true;
        if (operatorCarryOver.length > 0) {
            operatorCount = 1;
        } else {
            operatorCount = 0;
        }
        if (operatorCarryOver.length > 0) {
            equationString += response + operatorCarryOver[0];
            operatorCarryOver.splice(0, 1);
            console.log(equationString);
            console.log(operatorCarryOver);
            doubleOperator = true;
        }
        displayHistory();
    })
}

function displayHistory() {
    $.ajax({
        type: 'GET',
        url: '/history'
    }).then(function(response) {
        $('#historyTableBody').empty();
        for (let i = 0; i < response.calculations.length; i++) {
            let equation = response.calculations[i].replace(/sub/g, '-');
            $('#historyTableBody').prepend(`
                <tr>
                    <td class="history">${equation}</td>
                </tr>
            `);
        }
    });
}

function redoCalculation() {
    if (doubleOperator === true) {
        $('#display').text('');
        equationString += $(this).text().replace(/(?<=\d)-/g, 'sub');
    } else {
        equationString = '';
        $('#display').text('');
        equationString = $(this).text().replace(/(?<=\d)-/g, 'sub');
    }
    console.log(equationString);
    submitEquation();
}

function clearHistory() {
    $.ajax({
        type: 'DELETE',
        url: '/reset',
    }).then(function(response) {
        displayHistory();
        console.log(response);
        // doubleOperator = false;
        // operatorCount = 0;
        // doubleDecimal = false;
        // doubleNumber = false;
        // answerOnDisplay = true;
        // equationString = '';
        // operatorCarryOver = [];

    })
}
