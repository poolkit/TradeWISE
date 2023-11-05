document.addEventListener("DOMContentLoaded", function () {

    const apiKeyInput = document.getElementById("api-key");
    const saveApiKeyButton = document.getElementById("save-api-key");
    const savedText = document.getElementById("saved-api");
    const gettextView = document.getElementById("getText")
    const homePageView = document.getElementById("homePage")
    const changeApiButton = document.getElementById("change-api-key")
    const summarizeTradingView = document.getElementById("summarize-tradingview")
    const notTradingView = document.getElementById("not-tradingview")

    const tradingViewPrefix = "https://in.tradingview.com/news/"
    const undesiredPrefix = "category="
    // const summarizeButton = document.getElementById("summarize");

    homePageView.style.display = "none";
    gettextView.style.display = "none";
    summarizeTradingView.style.display = "none";
    notTradingView.style.display = "none";

    chrome.storage.sync.get("apiKey", function (result) {
        const loadedKey = result.apiKey;
        if (loadedKey) {
            gettextView.style.display = "block";
            savedText.textContent = loadedKey;
        } else {
            homePageView.style.display = "block";
        }
    });

    saveApiKeyButton.addEventListener("click", function () {
        const apiKey = apiKeyInput.value;
        chrome.storage.sync.set({ apiKey: apiKey })
        homePageView.style.display = "none";
        gettextView.style.display = "block";
    });

    changeApiButton.addEventListener("click", function () {
        gettextView.style.display = "none";
        homePageView.style.display = "block";
    });

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        var siteUrl = tabs[0].url;
        document.getElementById('url').textContent = siteUrl;

        if (siteUrl.startsWith(tradingViewPrefix) && !siteUrl.includes(undesiredPrefix)) {
            summarizeTradingView.style.display = "block";
        } else {
            notTradingView.style.display = "block";
        }
    });
});
