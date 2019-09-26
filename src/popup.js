var originalElementList = [];
var num_of_memes = 5;
if (localStorage.number !== undefined) {
	num_of_memes = localStorage.number;
}

console.log(localStorage);
if (localStorage.meme !== undefined) {
	originalElementList = JSON.parse(localStorage.getItem("meme"));
}

let tagsList = originalElementList;
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
	}

	// Add tag on click
	mainInput.addEventListener("keydown", function (arg) {
		if (arg.keyCode === 13) {
			addTag();
		}
	});

	// Add tag to the tag list function
	function addTag() {
		if (tagsList.length < num_of_memes) {
			document.getElementById('warning').innerHTML = "";
			var tag = createTag(mainInput.value);
			if (checkTagExists(tag, tags) == false) {
				tags.push(tag);
				el.insertBefore(tag.element, hiddenInput);
				addMemeKeyword(tag.text);
				addTagHelper(tag.text);	
			}
			mainInput.value = "";	
		} else {
			document.getElementById('warning').innerHTML = "Can only track "+ 
				num_of_memes.toString() +" memes or less."
		}
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



// Logic for adding social issues keywords

var social_issues = ['Climate', 'LGBT', 'AIDS', 'Immigration', 'Gun Reform', 'Cancer'];
let num_of_social_issues = 6;

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
    if (localStorage.meme === undefined) {
    	var storage_for_memes = [];
    	storage_for_memes.push(keyword);
    	localStorage.setItem("meme", JSON.stringify(storage_for_memes));
    } else {
    	var storage_for_memes = JSON.parse(localStorage.getItem("meme"));
    	storage_for_memes.push(keyword);
    	localStorage.setItem("meme", JSON.stringify(storage_for_memes));
    }
    
}

// Delete the meme keyword
function deleteMemeKeyword(keyword) {
    chrome.storage.sync.get("meme", function(result) {
      if (result.meme[keyword] !== undefined) {
          delete result.meme[keyword];
      }
    });
    var storage_for_memes = [];
    storage_for_memes = JSON.parse(localStorage.getItem("meme"));
    var idx = storage_for_memes.indexOf(keyword);
    if (idx !== -1) {
    	storage_for_memes.splice(idx, 1);
    }
}



let report = document.getElementById("report_button");
report.onclick = function() {
	chrome.storage.sync.get("meme", function(result) {
		var res = result.meme;
		var new_window = window.open("report.html");
		new_window.meme = res;
	});
};

