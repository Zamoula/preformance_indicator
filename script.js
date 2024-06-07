const express = require('express');
const { performance } = require('perf_hooks');
const os = require('os');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

const uploadDir = path.join(__dirname, 'uploads'); // Ensure 'uploads' directory exists

const upload = multer({ dest: uploadDir });

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle file uploads
app.use(upload.single('file')); // 'file' is the name attribute in the form data for the file

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
    return { executionTime };
  } else {
    throw new Error(`Function '${functionName}' not found in file '${filePath}'`);
  }
}

// Endpoint to measure function performance
app.post('/measure', (req, res) => {
  const { functionName, args } = req.body;

  // Ensure req.file exists and has the correct path
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  const filePath = req.file.path; // Path to the uploaded file

  try {
    const result = runAndMeasureFunction(filePath, functionName, ...args);
    const { cpuUsage, usedMemory } = measureUsage();

    // Convert values to units
    const formattedExecutionTime = `${result.executionTime.toFixed(2)} ms`;
    const formattedCpuUsage = `${cpuUsage} µs`;
    const formattedUsedMemory = `${(usedMemory / 1024 / 1024).toFixed(2)} MB`;

    res.json({
      success: true,
      executionTime: formattedExecutionTime,
      cpuUsage: formattedCpuUsage,
      usedMemory: formattedUsedMemory
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log("server running !");
});
