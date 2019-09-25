var originalElementList = [];
chrome.storage.sync.get("meme", function (result) {
	for (var key in result.meme) {
		if (result.meme.hasOwnProperty(key)) {
			originalElementList.push(key);
		} 
	}
});


[].forEach.call(document.getElementsByClassName('tags-input'), function (el) {
	let tagsList = originalElementList;
	let hiddenInput = document.createElement('input'),
		mainInput = document.createElement('input'),
		tags = [];
	hiddenInput.setAttribute('type', 'hidden');
	hiddenInput.setAttribute('name', el.getAttribute('data-name'));
	mainInput.setAttribute('type', 'text');
	mainInput.setAttribute('placeholder', 'Meme Keyword');
	mainInput.setAttribute('style', 'padding: 10px; font-size: 15px');
	mainInput.classList.add('main-input');

	// Add tag on click
	mainInput.addEventListener("keydown", function (arg) {
		if (arg.keyCode === 13) {
			addTag();
		}
	});

	function addTag() {
		if (tagsList.length < 5) {
			document.getElementById('warning').innerHTML = "";
			var tag = create_tag(mainInput.value);
			tags.push(tag);
			el.insertBefore(tag.element, hiddenInput);
			addMemeKeyword(tag.text);
			addTagHelper(tag.text);	
			mainInput.value = "";
		} else {
			document.getElementById('warning').innerHTML = "Can only track 5 memes or less."
		}
		
	};

	function create_tag(val) {
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

	el.appendChild(mainInput);
	el.appendChild(hiddenInput);

	function removeTag (index) {
		let tag = tags[index];
		tags.splice(index, 1);
		el.removeChild(tag.element);
		deleteMemeKeyword(tag.text);
		removeTagHelper(tag.text);
	}


	function removeTagHelper(inputtag) {
		var idx = tagsList.indexOf(inputtag);
		tagsList.splice(idx, 1);
	}


	function addTagHelper (inputtag) { 
		// Variable 'tagsList' contains all current tags
		tagsList.push(inputtag);
		hiddenInput.value = tagsList.join(',');
	}
})



// Logic for adding social issues keywords

var social_issues = ['Climate', 'LGBT', 'AIDS', 'Immigration', 'Gun Reform', 'Cancer'];
let num_of_social_issues = 6;

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

function addSocialIssueKeyword(keyword) {
	chrome.storage.sync.get("socialIssue", function(result) {
		result.socialIssue.push(keyword);
		console.log(result.socialIssue);
		chrome.storage.sync.set({"socialIssue":result.socialIssue}, function(){
        	console.log("updating");
        });
	});
}


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


function addMemeKeyword(keyword) {
    chrome.storage.sync.get("meme", function(result) {
      if (result.meme[keyword] === undefined) {
        result.meme[keyword] = 0;
        chrome.storage.sync.set({"meme":result.meme}, function(){
        	console.log("updating");
        });
      }
    });
}

function deleteMemeKeyword(keyword) {
    chrome.storage.sync.get("meme", function(result) {
      if (result.meme[keyword] !== undefined) {
          delete result.meme[keyword];
      }
    });
}



let report = document.getElementById("report_button");
report.onclick = function() {
	chrome.storage.sync.get("meme", function(result) {
		var res = result.meme;
		var new_window = window.open("report.html");
		new_window.meme = res;
	});
};

