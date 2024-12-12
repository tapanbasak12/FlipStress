// Define the size of each segment
const MEMCPY_MEMSIZE = 18*1024*1024; // 10 bytes per segment

// Create an ArrayBuffer with enough space for three segments
const buf = new ArrayBuffer(3 * MEMCPY_MEMSIZE);

// Create views for each segment
const str1 = new Uint8Array(buf, 0, MEMCPY_MEMSIZE);
const str2 = new Uint8Array(buf, MEMCPY_MEMSIZE, MEMCPY_MEMSIZE);
const str3 = new Uint8Array(buf, 2 * MEMCPY_MEMSIZE, MEMCPY_MEMSIZE);


function initializeMemcpyBuffers() {
    let startTime = performance.now();
    fillWithRandomBytes(str1);
    fillWithRandomBytes(str2);
    fillWithRandomBytes(str3);
    let endTime = performance.now();
    console.log(`Buffer Setup Time: ${endTime - startTime} ms`);
}

function fillWithRandomBytes(uintArray) {
    for (let i = 0; i < uintArray.length; i++) {
        uintArray[i] = Math.floor(Math.random() * 256);
    }
}

// Buffer initialization call
initializeMemcpyBuffers();



function naiveMemcpy(dest, src, n) {
    for (let i = 0; i < n; i++) {
        dest[i] = src[i];
    }
    //console.log("After naiveMemcpy:", dest);
    return dest;
}

function naiveMemmove(dest, src, n) {
    if (src.byteOffset < dest.byteOffset && (src.byteOffset + n > dest.byteOffset)) {
        // Copy backwards if there is overlap and src is before dest
        for (let i = n - 1; i >= 0; i--) {
            dest[i] = src[i];
        }
    } else {
        // Copy forwards if no overlap or safe to do so
        for (let i = 0; i < n; i++) {
            dest[i] = src[i];
        }
    }
    //console.log("After naiveMemmove:", dest);
    return dest;
}

function stressMemcpyNaive(str1, str2, str3, MEMCPY_MEMSIZE) {
    while(1) {
        //console.log("Before Operation - str1:", str1);
        //console.log("Before Operation - str2:", str2);
        //console.log("Before Operation - str3:", str3);

        naiveMemcpy(str3, str2, MEMCPY_MEMSIZE);
        naiveMemcpy(str2, str3, MEMCPY_MEMSIZE / 2);

        naiveMemmove(str3.subarray(64), str3, MEMCPY_MEMSIZE - 64);
        naiveMemcpy(str1, str2, MEMCPY_MEMSIZE);

        naiveMemmove(str3.subarray(64), str3, MEMCPY_MEMSIZE - 64);
        naiveMemcpy(str3, str1, MEMCPY_MEMSIZE);

        naiveMemmove(str3.subarray(1), str3, MEMCPY_MEMSIZE - 1);
        naiveMemmove(str3, str3.subarray(1), MEMCPY_MEMSIZE - 1);

        //console.log("End of Loop Iteration");
        // setTimeout(loop, 1000); // Loop with a 1-second delay to monitor changes
    }
}

// Assume using in a worker or similar environment
self.onmessage = function(event) {
    console.log("Message received in worker memcpy: ", event.data); // Debug message
    if (event.data === 'start') {

        stressMemcpyNaive(str1, str2, str3, MEMCPY_MEMSIZE);
    }
};
