const BUFFER_SIZE = 18 * 1024 * 1024 / 8;
let buffer1 = new Array(BUFFER_SIZE);
let buffer2 = new Array(BUFFER_SIZE);

//console.log(BUFFER_SIZE);
function fillBuffer(buffer) {
    for (let i = 0; i < BUFFER_SIZE; i++) {
        buffer[i] = Math.random();
    }

    //console.log("First ten elements of the buffer:", buffer.slice(0, 10));
}

function initializeBuffers() {
    let startTime = performance.now();
    fillBuffer(buffer1);
    fillBuffer(buffer2);
    let endTime = performance.now();
    console.log(`Buffer Initialization Time: ${endTime - startTime} ms`);
}

function write() {

    console.log(`Starting write Buffer Stressor`);
    while (true) {
        for (let i = 0; i < BUFFER_SIZE; i++) {
            buffer1[i]++;
        }

        for (let i = 0; i < BUFFER_SIZE; i++) {
            buffer2[i]++;
        }
   }
    
}

initializeBuffers();

self.onmessage = function(event) {
    console.log("Message received in worker writeBuffer: ", event.data); // Debug message
    if (event.data === 'start') {
        write();
    } 
};
