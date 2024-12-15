const BUFFER_SIZE = (18 * 1024 * 1024) /16;
//console.log(BUFFER_SIZE);
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

function createBuffer(size) {
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

function write(buffer1, buffer2) {
    //console.log(`Starting Write Linked List Stressor`);
    while (true) {
        
        let current = buffer1;

        while (current !== null) {
            current.data += 1;
            current = current.next;
        }

        current = buffer2;

        while (current !== null) {
            current.data += 1;
            current = current.next;
        }
    }
}


function initializeLinkedLists() {
    let startTime = performance.now();
    let buffer1 = createBuffer(BUFFER_SIZE);
    let buffer2 = createBuffer(BUFFER_SIZE);
    let endTime = performance.now();
    console.log(`LinkedList Creation Time: ${endTime - startTime} ms`);
    return { buffer1, buffer2 };
}


const { buffer1, buffer2 } = initializeLinkedLists();


self.onmessage = function(event) {
    console.log("Message received in worker write Linked List: ", event.data); // Debug message
    if (event.data === 'start') {
        write(buffer1, buffer2);
    }
};



