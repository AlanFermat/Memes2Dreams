function display(arg, count, img_src = undefined, href=undefined, head_line = undefined) {
	if (arg == 1 || arg == 2) {
		alert("Hello. You have read "+ count +
			" memes 😡\n");
	} else if (arg == 3) {
		var r = window.confirm("You have read "+ count+
			" instances of memes!\n"+
			"Do you want to share some meaningful posts for redemption?");
	  	if (r == true) {
		    var news_window = window.open("popup3.html");
		    if (img_src !== undefined) {
		    	news_window.img_src = img_src;
		    	news_window.href = href;
		    	news_window.head_line = head_line;
		    	console.log(news_window.img_src);
		    }
	  	}
	} else {
		alert("err");
	}
}