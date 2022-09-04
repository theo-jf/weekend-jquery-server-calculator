let doubleOperator = false;
let operatorCount = 0;
let doubleDecimal = false;
let doubleNumber = false;
let answerOnDisplay = true;
let equationString = '';
let operatorCarryOver = [];

$(readyNow);

function readyNow() {
    // TODO:

    // Delete server-stored history on page load
    // clearHistory();

    // Listener for #equals --> post request to server DONE
    $('#equals').on('click', submitEquation);

    // After (.then) post request, get request function to retrieve result 
    // Put result back into input like a real calculator
    // Calculation gets appended on server side to array which is loop displayed in history table

    // Separate function for table display (GET) which can be called when needed

    // Listener for #clear --> delete request to server, clear history table

    // Listeners for numbers (one giant listener on #calculator, (this) to get number?)
    // All client side(?) take pressed number / operator and put at the end of input. 
    $('#calculator').on('click', '.button', appendDisplay);

    // listener on entire table for click on history to re-run calculation (this)
    // Just re-push old calculation and do original post request again
    // Put answer in input, calculation at the top of history
    $('#historyTable').on('click', '.history', redoCalculation);

    // Don't forget .toFixed(#)! Look up how many digits a normal calculator goes until
}

function submitEquation() {
    if (!isNaN(equationString.charAt(equationString.length - 1))) {
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
    let symbol = String($(this).text());
    let buttonType = $(this).attr('class').split(' ')[1];
    if (buttonType === 'number') {
        if (answerOnDisplay === true || doubleOperator === true) {
            $('#display').text('');
            answerOnDisplay = false;
        }
        $('#display').append(`${symbol}`);
        doubleNumber = true;
        doubleOperator = false;
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
        operatorCount = 0;
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

