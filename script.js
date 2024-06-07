const { performance } = require('perf_hooks');
const os = require('os');

// Function to measure CPU and memory usage
function measureUsage() {
  const cpuUsage = process.cpuUsage().user;
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  return { cpuUsage, usedMemory };
}

// Function to run and measure the performance of a function from a file
function runAndMeasureFunction(filePath, functionName, ...args) {
  const module = require(filePath);
  const func = module[functionName];
  if (typeof func === 'function') {
    const startTime = performance.now();
    func(...args); // Execute the function with arguments
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    return executionTime;
  } else {
    throw new Error(`Function '${functionName}' not found in file '${filePath}'`);
  }
}

// Example usage: Run a function from a file and measure its performance
const filePath = './myFunctions.js'; // Path to your file
const functionName = 'myFunction'; // Name of the function to execute
const args = [/* Arguments to pass to the function */];

try {
  const executionTime = runAndMeasureFunction(filePath, functionName, ...args);
  const { cpuUsage, usedMemory } = measureUsage();

  console.log(`Execution time: ${executionTime} milliseconds`);
  console.log(`CPU Usage: ${cpuUsage} microseconds`);
  console.log(`Memory Usage: ${usedMemory / 1024 / 1024} MB`);
} catch (error) {
  console.error(error);
}
