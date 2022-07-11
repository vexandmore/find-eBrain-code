<script>
import CodeDisplay from './CodeDisplay.vue'

export default {
  data() {
    return {
      eBrainCode: '',
      world: {}
    }
  },
  components: {
    CodeDisplay
  },
  methods: {
    async tryForCode() {
        var self = this;
        self.eBrainCode = '';
        await this.USBconnect(function(msg) {
            self.eBrainCode = msg.msg.ap_ssid;
            console.log(msg.msg.ap_ssid);
        });
        this.writeToStream(JSON.stringify({cmd: "getConfig", id: "Df4h4"}));
    },

    async USBconnect(cb, connected, disconnected) {
    this.world.cb = cb;
    // Request & open port here.
    this.world.port = await navigator.serial.requestPort();
    if (connected) {
        connected();
    }
    // Wait for the port to open.
    await this.world.port.open({ baudRate: 230400 });

    // on disconnect, alert user and pause Snap!
    this.world.port.addEventListener('disconnect', event => {
        disconnected(event);
    });

    // Setup the output stream
    const encoder = new TextEncoderStream();
    var outputDone = encoder.readable.pipeTo(this.world.port.writable);
    this.world.outputStream = encoder.writable;

    // Make stream
    let decoder = new TextDecoderStream();
    var inputDone = this.world.port.readable.pipeTo(decoder.writable);
    var inputStream = decoder.readable;

    this.world.reader = inputStream.getReader();

    this.readLoop(); // Start infinite read loop
    },

    /**
     * This reads from the serial in a loop, and 
     * runs the given callback
     */
    async readLoop() {
    this.world.USB = '';
    console.log("USB Reader Listening...");

    while (true) {
        const { value, done } = await this.world.reader.read();
        if (value) {
        this.world.USB += value;
        console.log (value + '\n');

        // Now, I check if the JSON is complete and respond to the callback if necessary
        // and remove the message from the stack
        if (this.world.USB.includes('}')) {
            var messages = this.tryParseeBrainResponse(this.world.USB);
            for (var i = 0; i < messages.parsed.length; i++ ) {
            var message = messages.parsed[i];
            if (this.world.cb) {
                this.world.cb(message);
            }
            }
            this.world.USB = '';
            if (messages.unparseable) {
            this.world.USB = messages.unparseable;
            }
        }
        }
        if (done) {
        console.log('[readLoop] DONE', done);
        this.world.reader.releaseLock();
        break;
        }
    }
    },

    /**
     * Tries to parse string as json. Also verifies that it is valid (check it has an id).
     * NOTE: the json MUST end with '\r\n'
     * @return An object of form {parsed, unparseable}, where parseable is a 
     * list of all parseable objects and, unparseable is a string representing what remaining
     * bits couldn't be parsed (if such exists).
    */
    tryParseeBrainResponse(jsonString) {
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
    },

    writeToStream(...lines) {
    // Write to output stream
    const writer = this.world.outputStream.getWriter();
    lines.forEach((line) => {
        console.log('[SEND]', line);
        writer.write(line + '\n');
    });
    writer.releaseLock();
    }

  }
}
</script>

<template>
    <button class="btn btn-success btn-lg" @click="tryForCode">Get code!</button>
    <CodeDisplay v-bind:eBrainCode='eBrainCode'/>
</template>

<style scoped>
</style>




  