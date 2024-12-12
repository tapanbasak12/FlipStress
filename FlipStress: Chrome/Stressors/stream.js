const BUFFER_SIZE = (18 * 1024 * 1024)/8;



function tuned_STREAM_Copy() {
    for (let j = 0; j < BUFFER_SIZE; j++) {
        c[j] = a[j];
    }
}

// Function to scale array c by a scalar
function tuned_STREAM_Scale(scalar, b, c) {
    for (let j = 0; j < BUFFER_SIZE; j++) {
        b[j] = scalar * c[j];
    }
}

// Function to add arrays a and b and store the result in c
function tuned_STREAM_Add(a, b, c) {
    for (let j = 0; j < BUFFER_SIZE; j++) {
        c[j] = a[j] + b[j];
    }
}

// Function to perform a triad operation on arrays a, b, and c using a scalar
function tuned_STREAM_Triad(scalar, a, b, c) {
    for (let j = 0; j < BUFFER_SIZE; j++) {
        a[j] = b[j] + scalar * c[j];
    }
}

// Function to execute the operations
function executeOperations(scalar, arrays) {
    console.log(`Starting Stream Stressor`);
    const { a, b, c } = arrays;

    while (true) {
        tuned_STREAM_Copy() 
        tuned_STREAM_Scale(scalar, b, c);
        tuned_STREAM_Add(a, b, c);
        tuned_STREAM_Triad(scalar, a, b, c);
    }
}

function initializeStream() {
    let startTime = performance.now();
    let { a, b, c } = initializeArrays();
    const scalar = 2.0;  // Initialize scalar used in the stream operations
    let endTime = performance.now();
    console.log(`Stream Initialization Time: ${endTime - startTime} ms`);
    return { a, b, c, scalar };
}

function initializeArrays() {
    let a = new Array(BUFFER_SIZE);
    let b = new Array(BUFFER_SIZE);
    let c = new Array(BUFFER_SIZE);
    for (let i = 0; i < BUFFER_SIZE; i++) {
        a[i] = Math.random();
        b[i] = Math.random();
        c[i] = Math.random();
    }
    return { a, b, c };
}

// Initialization call in the main part of the script
const { a, b, c, scalar } = initializeStream();






self.onmessage = function(event) {
    console.log("Message received in worker stream: ", event.data); // Debug message
    if (event.data === 'start') {
        executeOperations(scalar, { a, b, c });
    }
};





