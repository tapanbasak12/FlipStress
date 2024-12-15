const bufSize = 18*1024*1024; 
let buffer = new Uint8Array(bufSize);

function stressVmCountBits8(v) {
    let n = 0;
    while (v) {
        v &= v - 1;
        n++;
    }
    return n;
}

function vm(buf) {
    
    console.log(bufSize);
    let bitErrors = 0;
    const prime = 61; // Prime less than cache line size

    // Stress Testing
    while(true) {
        for (let i = 0; i< 8  ; i++) { // Limited to 8 to avoid infinite loop
            const mask = ~(1 << i);
            for (let offset = 0; offset < bufSize; offset += prime) {
                buf[offset] &= mask;
            }
        }
    }

    // Count and Print bit errors
    for (let i = 0; i < bufSize; i++) {
        bitErrors += stressVmCountBits8(buf[i]);
    }
    console.log("Bit Errors: " + bitErrors);
    return bitErrors;
}

function initializeVMBuffer() {
    let startTime = performance.now();
    buffer.fill(0xFF);
    let endTime = performance.now();
    console.log(`Buffer Initialization Time: ${endTime - startTime} ms`);
}

// Buffer initialization call
initializeVMBuffer();

self.onmessage = function(event) {
    console.log("Message received in worker vm: ", event.data); // Debug message
    if (event.data === 'start') {
        vm(buffer);
    } 
};
