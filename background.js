var rule = {
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: 'youtube.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      };

function initStorage() {
    chrome.storage.sync.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
          console.error(error);
      }
  });
    chrome.storage.sync.set({ "meme" : {} }, function() {
    });
    chrome.storage.sync.set({ "socialIssue" : [] }, function() {
    });
     console.log('Initializing meme storage');
}

chrome.runtime.onInstalled.addListener(function() {
    initStorage();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([rule]);
    });
  });

function addMemeKeyword(keyword) {
  console.log("check 1");
    chrome.storage.sync.get("meme", function(result) {
      console.log("check2");
      // var memes = result.key;
      if (result.keyword === undefined) {
        console.log("check3");
        result.keyword = 0;
        console.log(result);
      }
    });
}