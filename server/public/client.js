let doubleOperator = false;

$(readyNow);

function readyNow() {
    // TODO:

    // Listener for #equals --> post request to server DONE
    $('#equals').on('click', '#display', submitEquation);

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
    $('#historyTable').on('click', '.history', submitEquation);

    // Don't forget .toFixed(#)! Look up how many digits a normal calculator goes until
}

function submitEquation() {
    let calculation = $(this).text();
    $.ajax({
        type: 'POST',
        url: '/function',
        data: {calculation}
    }).then(function(response) {
        console.log(response);
        getAnswer();
    });
}

function appendDisplay() {
    let symbol = $(this).text();
    let buttonType = $(this).attr('class').split(' ')[1];
    console.log(buttonType);
    if (buttonType === 'operator' && doubleOperator === false) {
        doubleOperator = true;
        $('#display').append(`${symbol}`);
    } if (buttonType === 'number') {
        doubleOperator = false;
        $('#display').append(`${symbol}`);
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

