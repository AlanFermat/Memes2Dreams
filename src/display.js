function display(arg, count, news_to_be_shown = undefined) {
	if (arg == 1) {
		alert("Hello. You have read "+ count +
			" memes 😡\n");
	} else if (arg == 2) {
		var r = window.confirm("You have read "+ count+
			" instances of memes!\n"+
			"Do you want to share some meaningful posts for redemption?");
	  	if (r == true) {
		    var news_window = window.open("src/carousel.html");
		    if (news_to_be_shown !== undefined) {
		    	news_window.news_to_be_shown = news_to_be_shown;
		    } else {
		    	alert("Hi! Please select the topics that interest you on the dropdown!");
		    }
	  	}
	} else {
		alert("err");
	}
}