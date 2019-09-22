// let memeButton = document.getElementById("trackmeme_button");
// let memeInput = document.getElementById("memeinput");

// memeButton.onclick = function(element) {
// 	var memeOutput = document.getElementById("memeoutput");
// 	var meme = memeInput.value;
// 	addMemeKeyword(meme);
// 	memeOutput.innerHTML = meme;
// };

[].forEach.call(document.getElementsByClassName('tags-input'), function (el) {
	let hiddenInput = document.createElement('input'),
		mainInput = document.createElement('input'),
		tags = [];

	hiddenInput.setAttribute('type', 'hidden');
	hiddenInput.setAttribute('name', el.getAttribute('data-name'));

	mainInput.setAttribute('type', 'text');
	mainInput.setAttribute('placeholder', 'Meme Keyword');
	mainInput.classList.add('main-input');

	// Add tag on click
	document.getElementById('thisbutton').onclick = function() {addTag()};

	function addTag() {
		let tag = {
			text: mainInput.value,
			element: document.createElement('span'),
		};

		tag.element.classList.add('tag');
		tag.element.textContent = tag.text;

		let closeBtn = document.createElement('span'); // Create close button on tag
		closeBtn.classList.add('close');
		closeBtn.addEventListener('click', function() {
			removeTag(tags.indexOf(tag));
		})
		tag.element.appendChild(closeBtn);

		tags.push(tag);

		el.insertBefore(tag.element, hiddenInput);

		addMemeKeyword(tag.text);

		refreshTags();

		mainInput.value = "";
	};

	el.appendChild(mainInput);
	el.appendChild(hiddenInput);

	function removeTag (index) {
		let tag = tags[index];
		tags.splice(index, 1);
		el.removeChild(tag.element);

		deleteMemeKeyword(tag.text);
		refreshTags();
	}

	function refreshTags () { // Variable 'tagsList' contains all current tags
		let tagsList = [];
		tags.forEach(function (t) {
			tagsList.push(t.text);
		});
		console.log(tagsList);
		hiddenInput.value = tagsList.join(',');
	}
})

// Logic for adding keywords

var social_issues = ['Climate Change', 'AIDS+', 'Immigration', 'Gun Reform', 'Cancer'];
let num_of_social_issues = 6;

for (var i = 0; i < num_of_social_issues; i++) {
	var name = "issue" + (i+1).toString();
	var issue = document.getElementById(name);
	issue.addEventListener('click', function() {
		if (this.style.type !== 'submit') {
			this.style.type = 'submit';
			this.style.cssText = "background: #ff0000;";
			addSocialIssueKeyword(this.innerHTML);
		} else {
			this.style.type = 'button';
			this.style.cssText = "background: #c19fcc;";
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

      // var memes = result.key;
      if (result.meme[keyword] !== undefined) {
          delete result.meme[keyword];
      }
    });
}



let report = document.getElementById("report_button");
let close_button = document.getElementById('close_report');
report.onclick = function() {
	close_button.style.cssText = 'display: inline;';
	var y = document.getElementById("storage");
	var x = document.getElementById("displayed");
	loadHTML("report.html", processHTML, x, y);
}



/**
	Searches for body, extracts and return the content
	New version contributed by users
*/


function getBody(content) 
{
   test = content.toLowerCase();    // to eliminate case sensitivity
   var x = test.indexOf("<body");
   if(x == -1) return "";

   x = test.indexOf(">", x);
   if(x == -1) return "";

   var y = test.lastIndexOf("</body>");
   if(y == -1) y = test.lastIndexOf("</html>");
   if(y == -1) y = content.length;    // If no HTML then just grab everything till end

   return content.slice(x + 1, y);   
} 

/**
	Loads a HTML page
	Put the content of the body tag into the current page.
	Arguments:
		url of the other HTML page to load
		id of the tag that has to hold the content
*/		

function loadHTML(url, fun, storage, param)
{
	var xhr = createXHR();
	console.log("im here");
	xhr.onreadystatechange=function()
	{ 
		if(xhr.readyState == 4)
		{
			//if(xhr.status == 200)
			{
				storage.innerHTML = getBody(xhr.responseText);
				fun(storage, param);
			}
		} 
	}; 

	xhr.open("GET", url , true);
	xhr.send(null); 

} 


/**
	Callback
	Assign directly a tag
*/		


function processHTML(temp, target)
{
	target.innerHTML = temp.innerHTML;
}





let report_body = document.getElementById('displayed');
close_button.onclick = function(element) {
  report_body.innerHTML = null;
  close_button.style.cssText = 'display: none;';
}











