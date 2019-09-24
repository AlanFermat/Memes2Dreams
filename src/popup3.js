var i;
var num_items = 5;
for (i = 1; i <= num_items; i++) {
	let image = document.getElementById('post_image' + i.toString());
	let head_line = document.getElementById('head_line'+ i.toString());
	let share_toggle = document.getElementById('card__share'+ i.toString());
	let social_bar = document.getElementById('card__social'+ i.toString());
	var idx = Math.floor(Math.random() * news_to_be_shown.length);
	image.src = news_to_be_shown[idx][2];
	head_line.href = news_to_be_shown[idx][1];
	head_line.innerHTML = news_to_be_shown[idx][0];
	share_toggle.onclick = function (e) {
	if (social_bar.className ==="card__social") {
		social_bar.className = "card__social--active";
	} else {
		social_bar.className = "card__social";
	}};
}
