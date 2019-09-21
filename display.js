function display(arg, count) {
	if (arg == 1 || arg == 2) {
		alert("You have read "+ count+
			" instances of memes!\nRemember your goals! Waste less time on memes!");
	} else if (arg == 3) {
		alert("You have read "+ count+"\npost");
	} else {
		alert("err");
	}
}