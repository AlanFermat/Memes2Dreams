var rule = {
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: 'twitter.com'},
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


chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    if (key == "meme") {
      var c = storageChange.newValue[key];
      if (c == 1) {
        display(1, c);
      } else if (c >= 10) {
        display(3, c);
      } else if (c >= 5) {
        display(2, c);
      }
    }
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});


// Parse the p tags elements in the loaded page and check if it contains the meme keywords
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('I received the following DOM content:\n' + request.content);
    var x = request.content;

    console.log(x.length);

    chrome.storage.sync.get("meme", function(result) {
      console.log(result.meme);

      var res = result.meme;

      for (i = 0; i < x.length; i++) {
        var h = x[i];

        for (var keyword in res) {
          if (h.includes(keyword)) {
            res[keyword] += 1;
          }
        }
      }

      console.log(res);

      chrome.storage.sync.set({"meme": res}, function(){
          console.log("updated meme counts");
        });
    });
  }
);