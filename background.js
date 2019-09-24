var rule = {
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: '.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      };

var news_to_be_shown = undefined;

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

function retrieveNews(strSocialIssue) {
    var allNews = [];
    var issueCall = 'q=' + strSocialIssue +'&';
    var url = 'https://newsapi.org/v2/everything?' +
           'language=en&' +
          issueCall +
         'apiKey=b8b1367fefdb4995a117ca642f6a87aa';
    var req = new Request(url);
    fetch(req)
        .then(response => {
            return response.json()
        })
        .then(data => {
            var rand_num = Math.floor(Math.random() * data.articles.length);
            var i;
            for(i = 0; i < data.articles.length; i++) {
               newsSubset = [];
               newsSubset.push(data.articles[i].title, data.articles[i].url, data.articles[i].urlToImage);
               allNews.push(newsSubset)
            }
        var final_news = allNews[rand_num];
        news_to_be_shown = final_news;
  })  
}


chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];

    if (key === "meme") {

      var c = 0;
      for (var keyword in storageChange.newValue) {
            // console.log(storageChange.newValue[keyword]+ "\n");
            c += storageChange.newValue[keyword];
      }

      // console.log(c);

      if (c >= 3 && c <= 10) {
        display(1, c);
      } else if (c >= 20) {
        chrome.storage.sync.get("socialIssue", function(result) {
          var candidates = result.socialIssue;
          // console.log(candidates);

        if (candidates.length !== 0) {
          
          // console.log(candidates);
          var social_issue = candidates[Math.floor(Math.random() * candidates.length)];
          retrieveNews(social_issue);
          // console.log(news_to_be_shown);
          var image_src = news_to_be_shown[2];
          var head_line = news_to_be_shown[0];
          var href = news_to_be_shown[1];
          display(3, c, img_src = image_src, href = href, head_line = head_line);
          }
        });
        
      } else if (c >= 10) {
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

    // console.log(x.length);

    chrome.storage.sync.get("meme", function(result) {
      // console.log(result.meme);

      var res = result.meme;

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