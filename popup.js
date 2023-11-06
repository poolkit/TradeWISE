document.addEventListener("DOMContentLoaded", function () {

    const apiKeyInput = document.getElementById("api-key");
    const saveApiKeyButton = document.getElementById("save-api-key");
    const savedText = document.getElementById("saved-api");
    const gettextView = document.getElementById("getText");
    const homePageView = document.getElementById("homePage");
    const displaySummaryView = document.getElementById("displaySummary");
    const changeApiButton = document.getElementById("change-api-key");
    const summarizeTradingView = document.getElementById("summarize-tradingview");
    const notTradingView = document.getElementById("not-tradingview");
    const summary = document.getElementById("api-summary");
    const opinion = document.getElementById("api-opinion");
    const displayErrorView = document.getElementById("displayError");
    const apiError = document.getElementById("api-error");

    const tradingViewPrefix = "https://in.tradingview.com/news/"
    const undesiredPrefix = "category="

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

    summarizeTradingView.addEventListener("click", async () => {
        // Show a loading indicator, if desired
        summarizeTradingView.disabled = true;

        try {
            const currentUrl = await getCurrentUrl();
            const responseData = await fetchDataFromAPI(currentUrl);
            const resultText = responseData.Result;
            
            try {
                const splitResult = resultText.split('CATEGORY:');
                // console.log(splitResult);
                const responseSummary = splitResult[0].trim();
                const responseOpinion = splitResult[1].trim();

                summary.textContent = responseSummary;
                opinion.textContent = responseOpinion;

                gettextView.style.display = "none";
                displaySummaryView.style.display = "block";
                summary.style.display = "block";

            } catch (error) {
                apiError.textContent = resultText._message;
                gettextView.style.display = "none";
                displayErrorView.style.display = "block";
                apiError.style.display = "block";
            }

        } catch (error) {
            console.error("Error:", error);
        } finally {
            summarizeTradingView.disabled = false;
        }
    });

    function getCurrentUrl() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs && tabs[0] && tabs[0].url) {
                    resolve(tabs[0].url);
                } else {
                    reject("Unable to retrieve current URL");
                }
            });
        });
    }

    async function fetchDataFromAPI(url) {
        const apiKey = await getApiKeyFromSyncStorage();

        try {
            const response = await fetch("https://poolkit-tradewise.hf.space/summarise", {
                method: "POST", // or "GET" or "PUT" as needed
                body: JSON.stringify({ openai_api_key: apiKey, url: url }), // Send the URL to the API
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                  }
            });

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            throw new Error("Failed to fetch data from the API: " + error.message);
        }
    }

    function getApiKeyFromSyncStorage() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(["apiKey"], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result.apiKey);
                }
            });
        });
    }


});
