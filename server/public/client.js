$(readyNow);

function readyNow() {
    // TODO:
    // Listener for #equals --> post request to server
    // After (.then) post request, get request function to retrieve result
    // Put result back into input like a real calculator
    // Calculation gets appended on server side to array which is loop displayed in history table

    // Separate function for table display (GET) which can be called when needed

    // Listener for #clear --> delete request to server, clear history table

    // Listeners for numbers (one giant listener on #calculator, (this) to get number?)
    // All client side(?) take pressed number / operator and put at the end of input. 

    // listener on entire table for click on history to re-run calculation (this)
    // Just re-push old calculation and do original post request again
    // Put answer in input, calculation at the top of history

    // Don't forget .toFixed(#)! Look up how many digits a normal calculator goes until
}