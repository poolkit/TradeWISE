document.addEventListener('DOMContentLoaded', function () {
    // Get the current URL and display it
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      const url = tabs[0].url;
      document.getElementById('url').textContent = url;
    });
  
    // Save user input to Chrome Sync
    const userInput = document.getElementById('userInput');
    const saveButton = document.getElementById('saveButton');
  
    saveButton.addEventListener('click', function () {
      const textToSave = userInput.value;
      chrome.storage.sync.set({ 'userText': textToSave }, function () {
        console.log('User input saved to Chrome Sync:', textToSave);
      });
    });
  
    // Load user input from Chrome Sync (optional)
    chrome.storage.sync.get(['userText'], function (result) {
      const savedText = result.userText;
      if (savedText) {
        userInput.value = savedText;
      }
    });
  });
  