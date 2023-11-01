document.addEventListener("DOMContentLoaded", function () {
    const savedText = document.getElementById("savedApi");

    chrome.storage.sync.get("apiKey", function (result) {
        const loadedKey = result.apiKey;
        if (loadedKey) {
        savedText.textContent = loadedKey;
        }
    });
});
  