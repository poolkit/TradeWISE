document.addEventListener('mouseup', function (event) {
    var selectedText = window.getSelection().toString();
    if (selectedText.length) {
      chrome.runtime.sendMessage({ text: selectedText });
    }
    console.log(selectedText)
  });