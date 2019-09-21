let memeInput = document.getElementById("memeinput");
memeInput.onclick = function(element) {
	var memeOutput = document.getElementById("memeoutput");
	console.log(memeInput.value);
	memeOutput.innerHTML = memeInput.value;
};
