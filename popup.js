let memeButton = document.getElementById("trackmeme_button");
let memeInput = document.getElementById("memeinput");
memeButton.onclick = function(element) {
	var memeOutput = document.getElementById("memeoutput");
	memeOutput.innerHTML = memeInput.value;
};
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











