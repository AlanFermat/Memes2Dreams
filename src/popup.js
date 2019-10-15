var originalMemeList = [];
var originalSocialIssueList = [];

var social_issues = JSON.parse(localStorage.getItem("newsList"));

for (var i = 1; i < 7; i++) {
	let issue = document.getElementById("issue" + i.toString());
	issue.innerHTML = social_issues[i-1];
}


console.log(localStorage);
if (localStorage.meme !== undefined) {
	originalMemeList = JSON.parse(localStorage.getItem("meme"));
}

if (localStorage.socialIssue !== undefined) {
	originalSocialIssueList = JSON.parse(localStorage.getItem("socialIssue"));
}

let tagsList = originalMemeList;
let container = document.getElementById("container"),
	issues_session = document.getElementById("issues");

[].forEach.call(document.getElementsByClassName('tags-input'), function (el) {
	let hiddenInput = document.createElement('input'),
		mainInput = document.createElement('input'),
		tags = [];
	hiddenInput.setAttribute('type', 'hidden');
	hiddenInput.setAttribute('name', el.getAttribute('data-name'));
	mainInput.setAttribute('type', 'text');
	mainInput.setAttribute('placeholder', 'Meme Keyword');
	mainInput.setAttribute('style', 'padding: 10px; font-size: 15px');
	mainInput.classList.add('main-input');
	el.appendChild(mainInput);
	el.appendChild(hiddenInput);

	// Load the original tags
	for (var i = 0; i < tagsList.length; i++) {
		var tag = createTag(tagsList[i]);
		tags.push(tag);	
		hiddenInput.value = tagsList.join(',');
		el.insertBefore(tag.element, hiddenInput);
		if (i > 0 && i % 5 === 0) {
			adjustMarginForMemes();
		}
	}

	// Add tag on click
	mainInput.addEventListener("keydown", function (arg) {
		if (arg.keyCode === 13) {
			addTag();
		}
	});

	// Add tag to the tag list function
	function addTag() {
		document.getElementById('warning').innerHTML = "";
		var tag = createTag(mainInput.value);
		if (checkTagExists(tag, tags) == false) {
			tags.push(tag);
			el.insertBefore(tag.element, hiddenInput);
			addMemeKeyword(tag.text);
			addTagHelper(tag.text);	
		}
		if (tagsList.length % 5 === 0) {
			adjustMarginForMemes();
		}
		mainInput.value = "";	
	};

	// If the tag has existed in the tag list
	function checkTagExists(tag, tags) {	
		for (var i = 0; i < tags.length; i++) {
			var check_tag = tags[i];
			if (check_tag.text === tag.text) {
				return true;
			}
		}
		return false;
	}

	// Create a new span element out of the tag
	function createTag(val) {
		let tag = {
			text: val,
			element: document.createElement('span'),
		};
		tag.element.classList.add('tag');
		tag.element.textContent = tag.text;
		tag.element.setAttribute('style', 'font-size: 15px');
		let closeBtn = document.createElement('span'); // Create close button on tag
		closeBtn.classList.add('close');
		closeBtn.addEventListener('click', function() {
			removeTag(tags.indexOf(tag));
		})
		tag.element.appendChild(closeBtn);
		return tag;
	}

	// Remove the tag
	function removeTag (index) {
		let tag = tags[index];
		tags.splice(index, 1);
		el.removeChild(tag.element);
		deleteMemeKeyword(tag.text);
		removeTagHelper(tag.text);
	}


	// Remove it from the tagsList
	function removeTagHelper(inputTag) {
		var idx = tagsList.indexOf(inputTag);
		tagsList.splice(idx, 1);
	}


	// Add the tag to the tagsList
	function addTagHelper (inputTag) { 
		// Variable 'tagsList' contains all current tags
		tagsList.push(inputTag);
		hiddenInput.value = tagsList.join(',');
	}
})


// Adjust the margin and passing when adding more memes 
function adjustMarginForMemes() {
	console.log("adjust margin");
	var container_height = container.offsetHeight + 100;
	var issues_top_margin = issues_session.offsetTop + 100;
	container.style.height = container_height + "px";
	issues_session.style.top = issues_top_margin + "px";
}



// Logic for adding social issues keywords


let num_of_social_issues = 6;


// recall the social issues that already put in
function init_social_issues() {
	for (var i = 0; i < num_of_social_issues; i++) {
		var name = "issue" + (i+1).toString();
		var issue = document.getElementById(name);
		if (originalSocialIssueList.includes(issue.innerHTML)) {
			issue.style.type = 'submit';
			issue.style.cssText = "background: #5d2d6d; color: white";
		}
	}
}


init_social_issues();

// create button logic for each social issue
for (var i = 0; i < num_of_social_issues; i++) {
	var name = "issue" + (i+1).toString();
	var issue = document.getElementById(name);
	issue.addEventListener('click', function() {
		if (this.style.type !== 'submit') {
			this.style.type = 'submit';
			this.style.cssText = "background: #5d2d6d; color: white";
			addSocialIssueKeyword(this.innerHTML);
		} else {
			this.style.type = 'button';
			this.style.cssText = "background: white;";
			deleteSocialIssueKeyword(this.innerHTML);
		}
		console.log("You clicked:", this.innerHTML);
	});
}


// Add the social keyword
function addSocialIssueKeyword(keyword) {
	chrome.storage.sync.get("socialIssue", function(result) {
		result.socialIssue.push(keyword);
		console.log(result.socialIssue);
		chrome.storage.sync.set({"socialIssue":result.socialIssue}, function(){
        	console.log("updating");
        });
	});
	var storage_social_issue = JSON.parse(localStorage.getItem("socialIssue"));
	storage_social_issue.push(keyword);
	localStorage.setItem("socialIssue", JSON.stringify(storage_social_issue));
	console.log("add socialIssue");
	console.log(localStorage);
}

// Delete the social issue keyword
function deleteSocialIssueKeyword(keyword) {
	chrome.storage.sync.get("socialIssue", function(result) {
		var idx = result.socialIssue.indexOf(keyword);
      	if (idx !== -1) {
      		result.socialIssue.splice(idx, 1);
      	}
      	chrome.storage.sync.set({"socialIssue":result.socialIssue}, function(){
        	console.log("updating");
        });
    });
    var storage_social_issue = JSON.parse(localStorage.getItem("socialIssue"));
    var idx = storage_social_issue.indexOf(keyword);
    if (idx !== -1) {
    	storage_social_issue.splice(idx, 1);
    }
    localStorage.setItem("socialIssue", JSON.stringify(storage_social_issue));
    console.log("delete socialIssue");
    console.log(localStorage);
}


// Add the meme keyword
function addMemeKeyword(keyword) {
    chrome.storage.sync.get("meme", function(result) {
      if (result.meme[keyword] === undefined) {
        result.meme[keyword] = 0;
        chrome.storage.sync.set({"meme":result.meme}, function(){
        	console.log("updating");
        });
      }
    });
	var storage_meme = JSON.parse(localStorage.getItem("meme"));
	storage_meme.push(keyword);
	localStorage.setItem("meme", JSON.stringify(storage_meme));
	console.log("add meme");
	console.log(localStorage);
    
}

// Delete the meme keyword
function deleteMemeKeyword(keyword) {
    chrome.storage.sync.get("meme", function(result) {
      if (result.meme[keyword] !== undefined) {
          delete result.meme[keyword];
      }
    });
    var storage_meme = JSON.parse(localStorage.getItem("meme"));
    var idx = storage_meme.indexOf(keyword);
    if (idx !== -1) {
    	storage_meme.splice(idx, 1);
    }
    localStorage.setItem("meme", JSON.stringify(storage_meme));
    console.log("delete meme");
    console.log(localStorage);
}


report_button.onclick = function() {
	chrome.storage.sync.get("meme", function(result) {
		var res = result.meme;
		var new_window = window.open("report.html");
		new_window.meme = res;
	});
};

