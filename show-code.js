var ebUSB = {doCallback: function(msg) {
    document.getElementById("codeView").innerHTML = msg.msg.ap_ssid;
    console.log(msg.msg.ap_ssid);
}}
var world = {};

async function tryForCode() {
  document.getElementById("codeView").innerHTML = "";
    await USBconnect();
    writeToStream(JSON.stringify({cmd: "getConfig", id: "Df4h4"}));
}

async function USBconnect() {
  // Request & open port here.
  world.port = await navigator.serial.requestPort();
  if (ebUSB) {
    ebUSB.connected = true;
  }
  // Wait for the port to open.
  await world.port.open({ baudRate: 230400 });

  // on disconnect, alert user and pause Snap!
  world.port.addEventListener('disconnect', event => {
    if (ebUSB) {
      ebUSB.connected = false; // signal disconnection to other code.
    }
  });

  // Setup the output stream
  const encoder = new TextEncoderStream();
  outputDone = encoder.readable.pipeTo(world.port.writable);
  world.outputStream = encoder.writable;

  // Make stream
  let decoder = new TextDecoderStream();
  inputDone = world.port.readable.pipeTo(decoder.writable);
  inputStream = decoder.readable;

  world.reader = inputStream.getReader();

  readLoop(); // Start infinite read loop
}

/**
 * This reads from the serial in a loop, and 
 * runs the given callbacks (using ebUSB).
 */
async function readLoop() {
  world.USB = '';
  console.log("USB Reader Listening...");

  while (true) {
    const { value, done } = await world.reader.read();
    if (value) {
      world.USB += value;
      console.log (value + '\n');

      // Now, I check if the JSON is complete and respond to the callback if necessary
      // and remove the message from the stack
      if (world.USB.includes('}')) {
        var messages = tryParseeBrainResponse(world.USB);
        for (var i = 0; i < messages.parsed.length; i++ ) {
          var message = messages.parsed[i];
          if (ebUSB) {
            ebUSB.doCallback(message);
          }
        }
        world.USB = '';
        if (messages.unparseable) {
          world.USB = messages.unparseable;
        }
      }
    }
    if (done) {
      console.log('[readLoop] DONE', done);
      world.reader.releaseLock();
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
  var out = {parsed: []};

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

function writeToStream(...lines) {
  // Write to output stream
  const writer = world.outputStream.getWriter();
  lines.forEach((line) => {
    console.log('[SEND]', line);
    writer.write(line + '\n');
  });
  writer.releaseLock();
}
