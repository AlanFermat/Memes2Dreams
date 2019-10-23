var i;
var num_items = 5;
time_els = document.getElementsByClassName('time');
var fb_link = "https://www.facebook.com/dialog/share?app_id=450390582265970&display=popup&href=";
var twitter_link = "https://twitter.com/intent/tweet?text=I+want+to+share+this+with+you+\n&url=";
var linkedin_link = "https://www.linkedin.com/shareArticle?mini=true&url=";

for (var j = 0; j < time_els.length ; j ++) {
	time_els[j].innerHTML = new Date().toJSON().slice(0, 10);
}


for (i = 1; i <= num_items; i++) {
	let image = document.getElementById('post_image' + i.toString());
	let head_line = document.getElementById('head_line'+ i.toString());
	let share_toggle = document.getElementById('card__share'+ i.toString());
	let social_bar = document.getElementById('card__social'+ i.toString());
	let fb_full_link = document.getElementById('fb' + i.toString());
	let twitter_full_link = document.getElementById('tt' + i.toString());
	let linkedin_full_link = document.getElementById("lk" + i.toString());
	var idx = Math.floor(Math.random() * news_to_be_shown.length);
	image.src = news_to_be_shown[idx][2];
	head_line.href = news_to_be_shown[idx][1];
	head_line.innerHTML = news_to_be_shown[idx][0];
	fb_full_link.href = fb_link + news_to_be_shown[idx][1];
	linkedin_full_link.href = linkedin_link + news_to_be_shown[idx][1] + "&summary=" + news_to_be_shown[idx][0];
	// console.log(fb_full_link);
	twitter_full_link.href = twitter_link + news_to_be_shown[idx][1];
	share_toggle.onclick = function (e) {
	if (social_bar.className ==="card__social") {
		social_bar.className = "card__social--active";
	} else {
		social_bar.className = "card__social";
	}};
}
