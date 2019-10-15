var rule = {
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: '.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      };
var apiKey = "b8b1367fefdb4995a117ca642f6a87aa";
var news_to_be_shown = [];
var news_per_category = 5;

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

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    localStorage.date = "2019-10-14";
    localStorage.meme = "[]";
    localStorage.socialIssue = "[]";
    localStorage.alertCount = "0";

    console.log("date is", localStorage.date);
    console.log('Initializing meme storage');
}

chrome.runtime.onInstalled.addListener(function() {
    initStorage();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([rule]);
    });
  });

function retrieveNews(strSocialIssue) {
    var allNews = [];
    var issueCall = 'q=' + strSocialIssue +'&';
    var url = 'https://newsapi.org/v2/everything?' +
           'language=en&' +
          issueCall +
         'apiKey=' + apiKey;
    var req = new Request(url);
    fetch(req)
        .then(response => {
            return response.json()
        })
        .then(data => {
            var i;
            for(i = 0; i < data.articles.length; i++) {
               newsSubset = [];
               newsSubset.push(data.articles[i].title, 
                data.articles[i].url, data.articles[i].urlToImage);
               allNews.push(newsSubset)
            }
            var j, k;
            j = 0;
            var rand_num = [];
            while (j < news_per_category) {
              var num = Math.floor(Math.random() * allNews.length);
              if (rand_num.includes(num) == false) {
                rand_num.push(num);
                j++;
              }
            }
            for (k = 0; k < news_per_category;k++) {
              news_to_be_shown.push(allNews[rand_num[k]]);
            }
    })
}


chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    if (key === "meme") {
      var c = 0;
      for (var keyword in storageChange.newValue) {
            c += storageChange.newValue[keyword];
      }
      var count = JSON.parse(localStorage.getItem("alertCount"));
      if (count < 3 || Math.exp(1.0 - count / 3.0) > Math.random()) {
        console.log("here");
        console.log(count);
        if (c >= 3 && c < 10) {
          display(1, c);
        } else if (c >= 10) {
          chrome.storage.sync.get("socialIssue", function(result) {
            var candidates = result.socialIssue;
            // console.log(candidates);
            if (candidates.length !== 0) {      
                for (var social_issue in candidates) {
                  retrieveNews(social_issue);
                }
                display(2, c, news_to_be_shown = news_to_be_shown);
            }
            else {
              display(1, c);
            }
          });
        }
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
    var x = request.content;
    chrome.storage.sync.get("meme", function(result) {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        var res = result.meme;

        if (date !== localStorage.getItem("date")) {
            localStorage.setItem("date", date);
            console.log(localStorage.date);
            // reset all keywords in res
            for (var key in res) {
                if (res.hasOwnProperty(key)) {
                    res[key] = 0;
                }
            }

        }

      for (i = 0; i < x.length; i++) {
        var h = x[i];
        for (var keyword in res) {
          if (h.includes(keyword)) {
            res[keyword] += 1;
          }
        }
      }

      chrome.storage.sync.set({"meme": res}, function(){
          console.log("updated meme counts");
        });
    });
  }
);