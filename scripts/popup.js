document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("api-key");
  const saveApiKeyButton = document.getElementById("save-api-key");
  // const summarizeButton = document.getElementById("summarize");

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    const url = tabs[0].url;
    document.getElementById('url').textContent = url;
  });

  saveApiKeyButton.addEventListener("click", function () {
    const apiKey = apiKeyInput.value;
    chrome.storage.sync.set({ apiKey: apiKey });

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: function () {
        // Load the second page content
        chrome.runtime.getURL("../templates/getText.html", function (url) {
          fetch(url)
            .then((response) => response.text())
            .then((html) => {
              document.documentElement.innerHTML = html;
            });
        });
      },
    });
  });
});

