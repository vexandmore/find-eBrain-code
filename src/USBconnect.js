export {USBconnect};

async function USBconnect(cb, connected, disconnected) {
    var out = {};
    addFunctions(out);
    // set callback when receive a message
    out.cb = cb;
    // set other callbacks
    out.connected = connected;
    out.disconnected = disconnected;
    // Request & open port here.
    out.port = await navigator.serial.requestPort();
    if (connected) {
        out.connected();
    }
    // Wait for the port to open.
    await out.port.open({ baudRate: 230400 });

    // on disconnect, run callback
    out.port.addEventListener('disconnect', event => {
        out.disconnected(event);
    });

    // Setup the output stream
    const encoder = new TextEncoderStream();
    out.outputDone = encoder.readable.pipeTo(out.port.writable);
    out.outputStream = encoder.writable;

    // Make stream
    let decoder = new TextDecoderStream();
    out.inputDone = out.port.readable.pipeTo(decoder.writable);
    var inputStream = decoder.readable;

    out.reader = inputStream.getReader();

    readLoop(out); // Start infinite read loop
    return out;
}

function addFunctions(out) {
    out.writeToStream = function(...lines) {
        // Write to output stream
        const writer = this.outputStream.getWriter();
        lines.forEach((line) => {
            console.log('[SEND]', line);
            writer.write(line + '\n');
        });
        writer.releaseLock();
    }
    
    out.disconnect = async function() {
        this.reader.cancel();
        await this.inputDone.catch(() => {/* ignore the error */});
        
        this.outputStream.getWriter().close();    
        await this.outputDone;
        await this.port.close();
    }
}

/**
 * This reads from the serial in a loop, and 
 * runs the given callback
 */
async function readLoop(out) {
    out.USB = '';
    console.log("USB Reader Listening...");

    while (true) {
        const { value, done } = await out.reader.read();
        if (value) {
            out.USB += value;
            console.log(value + '\n');

            // Now, I check if the JSON is complete and respond to the callback if necessary
            // and remove the message from the stack
            if (out.USB.includes('}')) {
                var messages = tryParseeBrainResponse(out.USB);
                for (var i = 0; i < messages.parsed.length; i++) {
                    var message = messages.parsed[i];
                    if (out.cb) {
                        out.cb(message);
                    }
                }
                out.USB = '';
                if (messages.unparseable) {
                    out.USB = messages.unparseable;
                }
            }
        }
        if (done) {
            console.log('[readLoop] DONE', done);
            out.reader.releaseLock();
            break;
        }
    }
}

/**
 * Tries to parse string as json. Also verifies that it is valid (check it has an id).
 * NOTE: the json MUST end with '\r\n'
 * @return An object of form {parsed, unparseable}, where parseable is a 
 * list of all parseable objects and, unparseable is a string representing what remaining
 * bits couldn't be parsed (if such exists).
*/
function tryParseeBrainResponse(jsonString) {
    var out = { parsed: [] };

    // First, try and split if there are multiple objects being returned
    var jsons = jsonString.split('\r\n');
    for (var i = 0; i < jsons.length; i++) {
        try {
            var response = JSON.parse(jsons[i]);
            if (response && typeof response === "object" && response.id) {
                out.parsed.push(response);
            }
        } catch (e) {
            // Only add a str to unparseable if it's at the end.
            if (i == jsons.length - 1) {
                out.unparseable = jsons[i];
            }
        }
    }
    return out;
}