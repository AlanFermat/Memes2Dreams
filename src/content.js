window.onload =	function () {
    // If the received message has the expected format...

        // Call the specified callback, passing
        // the web-page's DOM content as argument
        // console.log(document.getElementsByTagName("P")[0].innerHTML);

        var x = document.getElementsByTagName("P");
        // chrome.runtime.sendMessage({"content": x});

        var content = [];

		var i;
		for (i = 0; i < x.length; i++) {
			// x[i].style.backgroundColor = "red";
			content.push(x[i].innerHTML);
			// chrome.runtime.sendMessage({"content": x[i].innerHTML});

		}
		// console.log(content);
		chrome.runtime.sendMessage({"content": content});
        // chrome.runtime.sendMessage({"content": document.getElementsByTagName("P")[0].innerHTML});

};