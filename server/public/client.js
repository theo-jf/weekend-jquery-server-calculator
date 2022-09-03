let doubleOperator = false;
let equationString = '';
let answerOnDisplay = false;
let doubleDecimal = false;

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
    equationString += $('#display').text();
    console.log(equationString);
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
    if (buttonType === 'number' && doubleOperator === false) {
        if (answerOnDisplay === true) {
            $('#display').text('');
            answerOnDisplay = false;
        }
        $('#display').append(`${symbol}`);
    } if (buttonType === 'decimal') {
        if (answerOnDisplay === true) {
            $('#display').text('');
            answerOnDisplay = false;
        }
        if (doubleDecimal === false) {
            $('#display').append(`${symbol}`);
            doubleDecimal = true;
        }
    } if (buttonType === 'operator') {
        doubleDecimal = false;
        if (doubleOperator === false) {
            equationString += $('#display').text();
            doubleOperator = true;
        } else if (doubleOperator === true) {
            equationString = equationString.slice(0, -1);
        }
        if ($(this).attr('id') === 'subtract') {
            equationString += 'sub';
        } else {
            equationString += symbol;
        } 
    } if (buttonType === 'number' && doubleOperator === true) {
        // clear the display
        $('#display').text('');
        $('#display').append(`${symbol}`);
        doubleOperator = false;
    } if (buttonType === 'posNeg') {
        if (doubleOperator === true) {
            $('#display').text('');
            doubleOperator = false;
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
        doubleOperator = false;
        doubleDecimal = false;
        answerOnDisplay = true;
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
    equationString = '';
    $('#display').text('');
    // equationString = $(this).text().replace(/-[\d]/g, 'sub-');
    equationString = $(this).text().replace(/(?<=\d)-/g, 'sub');
    console.log(equationString);
    submitEquation();
}

