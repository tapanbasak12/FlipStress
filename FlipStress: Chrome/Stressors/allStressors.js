const BUFFER_SIZE = 18 * 1024 * 1024 / 8;
const BUFFER_SIZE_LL = (18 * 1024 * 1024) / 16;

let readBuffer1 = new Array(BUFFER_SIZE);
let readBuffer2 = new Array(BUFFER_SIZE);

let writeBuffer1 = new Array(BUFFER_SIZE);
let writeBuffer2 = new Array(BUFFER_SIZE);

let readLinkedList1;
let readLinkedList2;

let writeLinkedList1;
let writeLinkedList2;

let a = new Array(BUFFER_SIZE);
let b = new Array(BUFFER_SIZE);
let c = new Array(BUFFER_SIZE);
const scalar = 2.0;

const VM_BUFFER_SIZE = 18 * 1024 * 1024;
let vmBuffer = new Uint8Array(VM_BUFFER_SIZE);

const MEMCPY_MEMSIZE = 18 * 1024 * 1024;

const memcpy_buf = new ArrayBuffer(3 * MEMCPY_MEMSIZE);

const str1 = new Uint8Array(memcpy_buf, 0, MEMCPY_MEMSIZE);
const str2 = new Uint8Array(memcpy_buf, MEMCPY_MEMSIZE, MEMCPY_MEMSIZE);
const str3 = new Uint8Array(memcpy_buf, 2 * MEMCPY_MEMSIZE, MEMCPY_MEMSIZE);


let duration = 500; 

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

function fillBuffer(buffer) {
    for (let i = 0; i < BUFFER_SIZE; i++) {
        buffer[i] = Math.random();
    }
}

function fillLinkedList(size) {
    
    let head = null;
    let current = null;

    for (let i = 0; i < size; i++) {
        const newNode = new Node(Math.random());

        if (head === null) {
            head = newNode;
            current = newNode;
        } else {
            current.next = newNode;
            current = current.next;
        }
    }

    return head;
}

function initializeReadLinkedLists() {
    let startTime = performance.now();
    readLinkedList1 = fillLinkedList(BUFFER_SIZE_LL);
    readLinkedList2 = fillLinkedList(BUFFER_SIZE_LL);
    let endTime = performance.now();
    console.log(`Read Linked List Initialized in: ${endTime - startTime} ms`);
    return { readLinkedList1, readLinkedList2 };
}

function initializeWriteLinkedLists() {
    let startTime = performance.now();
    writeLinkedList1 = fillLinkedList(BUFFER_SIZE_LL);
    writeLinkedList2 = fillLinkedList(BUFFER_SIZE_LL);
    let endTime = performance.now();
    console.log(`Write Linked List Initialized in: ${endTime - startTime} ms`);
    return { writeLinkedList1, writeLinkedList2 };
}

function initializeReadBuffers() {
    let startTime = performance.now();
    fillBuffer(readBuffer1);
    fillBuffer(readBuffer2);
    let endTime = performance.now();
    console.log(`Read Buffer Initialized in: ${endTime - startTime} ms`);
}

function initializeWriteBuffers() {
    let startTime = performance.now();
    fillBuffer(writeBuffer1);
    fillBuffer(writeBuffer2);
    let endTime = performance.now();
    console.log(`Write Buffer Initialized in: ${endTime - startTime} ms`);
}

function initializeStreamArrays() {
    let startTime = performance.now();
    for (let i = 0; i < BUFFER_SIZE; i++) {
        a[i] = Math.random();
        b[i] = Math.random();
        c[i] = Math.random();
    }

    let endTime = performance.now();
    console.log(`Stream Initialized in: ${endTime - startTime} ms`);
}

function initializeVMBuffer() {
    let startTime = performance.now();
    vmBuffer.fill(0xFF);
    let endTime = performance.now();
    console.log(`VM Buffer Initialized in: ${endTime - startTime} ms`);
}

function fillWithRandomBytes(uintArray) {
    for (let i = 0; i < uintArray.length; i++) {
        uintArray[i] = Math.floor(Math.random() * 256);
    }
}

function initializeMemcpyBuffers() {
    let startTime = performance.now();
    fillWithRandomBytes(str1);
    fillWithRandomBytes(str2);
    fillWithRandomBytes(str3);
    let endTime = performance.now();
    console.log(`Memcpy Buffers Initialized in: ${endTime - startTime} ms`);
}

function tuned_STREAM_Copy() {
    for (let j = 0; j < BUFFER_SIZE; j++) {
        c[j] = a[j];
    }
}

function tuned_STREAM_Scale(scalar, b, c) {
    for (let j = 0; j < BUFFER_SIZE; j++) {
        b[j] = scalar * c[j];
    }
}

function tuned_STREAM_Add(a, b, c) {
    for (let j = 0; j < BUFFER_SIZE; j++) {
        c[j] = a[j] + b[j];
    }
}

function tuned_STREAM_Triad(scalar, a, b, c) {
    for (let j = 0; j < BUFFER_SIZE; j++) {
        a[j] = b[j] + scalar * c[j];
    }
}

function naiveMemcpy(dest, src, n) {
    for (let i = 0; i < n; i++) {
        dest[i] = src[i];
    }
    return dest;
}

function naiveMemmove(dest, src, n) {
    if (src.byteOffset < dest.byteOffset && (src.byteOffset + n > dest.byteOffset)) {
        for (let i = n - 1; i >= 0; i--) {
            dest[i] = src[i];
        }
    } else {
        for (let i = 0; i < n; i++) {
            dest[i] = src[i];
        }
    }
    return dest;
}

// Modify stressor functions to accept duration as a parameter
function readBuffer(duration) {
    //console.log(`Stressor Started: Read Buffer`);

    let startTime = performance.now();
    let endTime = startTime + duration;
    let global = 0;
    while (performance.now() < endTime) {
        for (let i = 0; i < BUFFER_SIZE; i++) {
            global = readBuffer1[i];
        }

        for (let i = 0; i < BUFFER_SIZE; i++) {
            global = readBuffer2[i];
        }
    }
}

function writeBuffer(duration) {
    //console.log(`Stressor Started: Write Buffer`);

    let startTime = performance.now();
    let endTime = startTime + duration;

    while (performance.now() < endTime) {
        for (let i = 0; i < BUFFER_SIZE; i++) {
            writeBuffer1[i]++;
        }

        for (let i = 0; i < BUFFER_SIZE; i++) {
            writeBuffer2[i]++;
        }
    }
}

function readLinkedList(readLinkedList1, readLinkedList2, duration) {
    //console.log(`Stressor Started: Read Linked List`);

    let startTime = performance.now();
    let endTime = startTime + duration;
    let global = 0;

    while (performance.now() < endTime) {
        let current = readLinkedList1;

        while (current !== null) {
            global = current.data;
            current = current.next;
        }

        current = readLinkedList2;

        while (current !== null) {
            global = current.data;
            current = current.next;
        }
    }
}

function writeLinkedList(writeLinkedList1, writeLinkedList2, duration) {
    //console.log(`Stressor Started: Write Linked List`);

    let startTime = performance.now();
    let endTime = startTime + duration;

    while (performance.now() < endTime) {
        let current = writeLinkedList1;

        while (current !== null) {
            current.data += 1;
            current = current.next;
        }

        current = writeLinkedList2;

        while (current !== null) {
            current.data += 1;
            current = current.next;
        }
    }
}

function stream(duration) {
    //console.log(`Stressor Started: Stream`);
    let startTime = performance.now();
    let endTime = startTime + duration;

    while (performance.now() < endTime) {
        tuned_STREAM_Copy();
        tuned_STREAM_Scale(scalar, b, c);
        tuned_STREAM_Add(a, b, c);
        tuned_STREAM_Triad(scalar, a, b, c);
    }
}

function vm(duration) {
    const prime = 61;
    //console.log(`Stressor Started: VM`);
    let startTime = performance.now();
    let endTime = startTime + duration;

    while (performance.now() < endTime) {
        for (let i = 0; i < 8; i++) {
            const mask = ~(1 << i);
            for (let offset = 0; offset < VM_BUFFER_SIZE; offset += prime) {
                vmBuffer[offset] &= mask;
            }
        }
    }
}

function memcpy(duration) {
    //console.log(`Stressor Started: memcpy`);
    let startTime = performance.now();
    let endTime = startTime + duration;

    while (performance.now() < endTime) {
        naiveMemcpy(str3, str2, MEMCPY_MEMSIZE);
        naiveMemcpy(str2, str3, MEMCPY_MEMSIZE / 2);

        naiveMemmove(str3.subarray(64), str3, MEMCPY_MEMSIZE - 64);
        naiveMemcpy(str1, str2, MEMCPY_MEMSIZE);

        naiveMemmove(str3.subarray(64), str3, MEMCPY_MEMSIZE - 64);
        naiveMemcpy(str3, str1, MEMCPY_MEMSIZE);

        naiveMemmove(str3.subarray(1), str3, MEMCPY_MEMSIZE - 1);
        naiveMemmove(str3, str3.subarray(1), MEMCPY_MEMSIZE - 1);
    }
}

function initializeAll() {
    let initStartTime = performance.now();

    initializeReadBuffers();
    initializeWriteBuffers();
    initializeReadLinkedLists();
    initializeWriteLinkedLists();
    initializeStreamArrays();
    initializeVMBuffer();
    initializeMemcpyBuffers();
    let initEndTime = performance.now();
    console.log(`All Stressors Initialized in: ${initEndTime - initStartTime} ms`);
}

// Simple seedable random number generator
function SimpleRNG(seed) {
    this.seed = seed;
    this.next = function () {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed/233280;
    };
}

self.onmessage = function (event) {
    if (event.data === 'start') {
        initializeAll();
        const rng = new SimpleRNG(12345); // Fixed seed

        // Modify your functions array to pass duration as an argument
        const functions = [
            (duration) => readBuffer(duration),
            (duration) => writeBuffer(duration),
            (duration) => readLinkedList(readLinkedList1, readLinkedList2, duration),
            (duration) => writeLinkedList(writeLinkedList1, writeLinkedList2, duration),
            (duration) => stream(duration),
            (duration) => vm(duration),
            (duration) => memcpy(duration)
        ];

        let previousFunctionIndex = -1; // To store the previous function index

        while (true) {
           
            let randomFunctionIndex;

            // Truly random, not using seed, remove for reproducibility
            do {
                randomFunctionIndex = Math.floor( rng.next() * /* Math.random() */  functions.length);
            } while (randomFunctionIndex === previousFunctionIndex);
           
            previousFunctionIndex = randomFunctionIndex;

            // Generate a random duration between 1 and 5 seconds (in milliseconds)
            //let minDuration = 100; // 1 second
            //let maxDuration = 1000; // 5 seconds
            //let duration = Math.random() * (maxDuration - minDuration) + minDuration;
            //console.log(`Duration: ${duration} ms`); 

            //Execute the chosen function with the random duration
            functions[randomFunctionIndex](duration);
        }
    }
};
