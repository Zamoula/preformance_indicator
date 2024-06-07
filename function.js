// Example function to be measured
function myFunction() {
    // Perform some computations
    for (let i = 0; i < 1e6; i++) {
      Math.sqrt(i);
    }
  }
  
  // Another example function
  function anotherFunction(a, b) {
    return a + b;
  }
  
  // Export functions
  module.exports = {
    myFunction,
    anotherFunction,
  };
  