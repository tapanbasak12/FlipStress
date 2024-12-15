document.addEventListener('DOMContentLoaded', function () {
    let workers = [];  // Array to hold active workers
    let stressors = [
        'Stressors/readBuffer.js',
        'Stressors/writeBuffer.js',
        'Stressors/readLinkedList.js',
        'Stressors/writeLinkedList.js',
        'Stressors/stream.js',
        'Stressors/vm.js',
        'Stressors/memcpy.js',
        'Stressors/allStressors.js'
    ];
    const numWorkersInput = document.getElementById('numWorkers');
    const statusDiv = document.getElementById('status');  // Reference to the status div
    let intervalId = null;

    // Function to update the status div
    function updateStatus(message) {
        statusDiv.textContent = message;
    }

    // Function to start workers for a given stressor
    function startWorkers(stressorScript) {
        const numWorkers = parseInt(numWorkersInput.value, 10);
        if (isNaN(numWorkers) || numWorkers < 1) {
            updateStatus('Invalid number of workers. Please enter a valid number.');
            return;
        }
        stopAllWorkers();  // Ensure all workers are stopped before starting new ones
        
        for (let i = 0; i < numWorkers; i++) {
            let worker = new Worker(stressorScript);
            worker.onmessage = function(e) {
                console.log(`Worker ${i + 1} message: `, e.data);
            };
            worker.onerror = function(error) {
                console.error(`Worker ${i + 1} error: `, error);
            };
            workers.push(worker);
            worker.postMessage('start');  // Start the worker
        }
        updateStatus(`${numWorkers} workers started for ${stressorScript.split('/').pop()}.`);
    }

    // Function to stop all workers
    function stopAllWorkers() {
        workers.forEach(worker => worker.terminate());
        workers = [];
        updateStatus('All workers terminated.');
    }

    // Start workers when the start button is clicked
    const startButton = document.getElementById('startWorkers');
    startButton.addEventListener('click', function() {
        const stressorScript = document.getElementById('stressorType').value;
        startWorkers(stressorScript);
    });

    // Stop all workers when the stop button is clicked
    const stopButton = document.getElementById('stopAllWorkers');
    stopButton.addEventListener('click', stopAllWorkers);

    
    
});
