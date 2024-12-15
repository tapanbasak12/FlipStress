const BUFFER_SIZE = 18 * 1024 * 1024 / 8;
const BUFFER_SIZE_LL = (18 * 1024 * 1024) /16;

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


const VM_BUFFER_SIZE = 18*1024*1024; 
let vmBuffer = new Uint8Array(VM_BUFFER_SIZE);


const MEMCPY_MEMSIZE = 18*1024*1024; 

const memcpy_buf = new ArrayBuffer(3 * MEMCPY_MEMSIZE);

const str1 = new Uint8Array(memcpy_buf, 0, MEMCPY_MEMSIZE);
const str2 = new Uint8Array(memcpy_buf, MEMCPY_MEMSIZE, MEMCPY_MEMSIZE);
const str3 = new Uint8Array(memcpy_buf, 2 * MEMCPY_MEMSIZE, MEMCPY_MEMSIZE);



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
    return { readLinkedList1, readLinkedList2 };
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

function readBuffer() {
    console.log(`Stressor Started: Read Buffer`);

    let startTime = performance.now();
    let endTime = startTime + 1000;
    let global = 0;
    while (performance.now() < endTime){
        for (let i = 0; i < BUFFER_SIZE; i++) {
            global = readBuffer1[i];
        }


        for (let i = 0; i < BUFFER_SIZE; i++) {
            global = readBuffer2[i];
        }

    }

}

function writeBuffer() {

    console.log(`Stressor Started: Write Buffer`);

    let startTime = performance.now();
    let endTime = startTime + 1000;
    
    while (performance.now() < endTime){
        for (let i = 0; i < BUFFER_SIZE; i++) {
            writeBuffer1[i]++;
        }

        for (let i = 0; i < BUFFER_SIZE; i++) {
            writeBuffer2[i]++;
        }
   }
    
}

function readLinkedList(readLinkedList1, readLinkedList2) {
    console.log(`Stressor Started: Read Linked List`);

    let startTime = performance.now();
    let endTime = startTime + 1000;
    let global = 0;

    while (performance.now() < endTime){
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

function writeLinkedList(writeLinkedList1, writeLinkedList2) {
    console.log(`Stressor Started: Write Linked List`);

    let startTime = performance.now();
    let endTime = startTime + 1000;

    while (performance.now() < endTime){
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

function stream() {
    console.log(`Stressor Started: Stream`);
    let startTime = performance.now();
    let endTime = startTime + 1000;

    while (performance.now() < endTime) {
        tuned_STREAM_Copy() 
        tuned_STREAM_Scale(scalar, b, c);
        tuned_STREAM_Add(a, b, c);
        tuned_STREAM_Triad(scalar, a, b, c);
    }
}

function vm() {
    
    const prime = 61; 
    console.log(`Stressor Started: VM`);
    let startTime = performance.now();
    let endTime = startTime + 1000;
    
    while(performance.now() < endTime)  {
        for (let i = 0; i< 8  ; i++) { 
            const mask = ~(1 << i);
            for (let offset = 0; offset < VM_BUFFER_SIZE; offset += prime) {
                vmBuffer[offset] &= mask;
            }
        }
    }

}

function memcpy() {
    console.log(`Stressor Started: memcpy`);
    let startTime = performance.now();
    let endTime = startTime + 1000;
    
    while(performance.now() < endTime){
        

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


function initializeAll()
{
    
    let initStartTime = performance.now();
    
    initializeReadBuffers();
    initializeWriteBuffers();
    initializeReadLinkedLists();
    initializeWriteLinkedLists();
    initializeStreamArrays();
    initializeVMBuffer();
    initializeMemcpyBuffers()
    let initEndTime = performance.now();
    console.log(`All Stresssors now Inititalized: "${initEndTime - initStartTime} ms`);
    
}


/*
// Add event listener or similar to start stressors
self.onmessage = function(event) {
    if (event.data === 'start') {
        initializeAll();
        while(true) {
            //readBuffer();
            writeBuffer();
            readLinkedList(readLinkedList1, readLinkedList2);
            writeLinkedList(writeLinkedList1, writeLinkedList2);
            stream();
            vm();
            //memcpy();
        }
    }
};
*/


// Simple seedable random number generator
function SimpleRNG(seed) {
    this.seed = seed;
    this.next = function() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    };
}

self.onmessage = function(event) {
    if (event.data === 'start') {
        initializeAll();
        const rng = new SimpleRNG(12345); // Fixed seed
        const functions = [
            readBuffer,
            writeBuffer,
            () => readLinkedList(readLinkedList1, readLinkedList2),
            () => writeLinkedList(writeLinkedList1, writeLinkedList2),
            stream,
            vm,
            memcpy
        ];

        let previousFunctionIndex = -1; // To store the previous function index

        while (true) {
            let randomFunctionIndex;
            do {
                randomFunctionIndex = Math.floor(rng.next() * functions.length);
            } while (randomFunctionIndex === previousFunctionIndex);

            // Update previousFunctionIndex to the current one
            previousFunctionIndex = randomFunctionIndex;

            // Execute the chosen function
            functions[randomFunctionIndex]();
        }
    }
};




/* Combination of stressors where each stressor is independently chosen
// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to generate a random group of stressors
function generateRandomGroup(stressors, groupSize) {
    const shuffledStressors = shuffleArray(stressors.slice());
    return shuffledStressors.slice(0, groupSize);
}

self.onmessage = function(event) {
    if (event.data === 'start') {
        initializeAll();
        
        const stressors = [
            //readBuffer,
            writeBuffer,
            () => readLinkedList(readLinkedList1, readLinkedList2),
            () => writeLinkedList(writeLinkedList1, writeLinkedList2),
            stream,
            vm,
            //memcpy
        ];

        setInterval(() => {
            // Generate a random group of 4 stressors
            const randomGroup = generateRandomGroup(stressors, 4);
            
            // Execute each stressor in the randomized group
            randomGroup.forEach(stressor => {
                stressor();
            });

        }, 1000);  // Run every second
    }
};

*/




