// Runs first, synchronously, from <head>: marks the document as script-enabled so progressive-enhancement styles
// (scroll reveals) only apply when JavaScript is available. External file so pages need no inline script.
document.documentElement.classList.add('js');
