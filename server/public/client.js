let doubleOperator = false;
let equationString = '';

$(readyNow);

function readyNow() {
    // TODO:

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
    $('#historyTable').on('click', '.history', {target: this}, submitEquation);

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
        $('#display').append(`${symbol}`);
    } if (buttonType === 'operator') {
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
        $('#display').append(response);
        doubleOperator = false;
        displayHistory();
    })
}

function displayHistory() {
    $.ajax({
        type: 'GET',
        url: '/history'
    }).then(function(response) {
        $('#historyTableBody').empty();
        for (let calculation of response) {
            $('#historyTableBody').append(`
                <tr>
                    <td class="history">${calculation}</td>
                </tr>
            `);
        }
    });
}

