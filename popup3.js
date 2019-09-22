let image = document.getElementById('post_image');
let head_line = document.getElementById('head_line');
let share_toggle = document.getElementById('card__share');
let social_bar = document.getElementById('card__social');

console.log(window.href);
image.src = window.img_src;
head_line.href = window.href;
head_line.innerHTML = window.head_line;


share_toggle.onclick = function (e) {
	console.log(social_bar);
	console.log(social_bar.className);
	// social_bar.setAttribute("class", "card__social--active");
	if (social_bar.className ==="card__social") {
		social_bar.className = "card__social--active";
	} else {
		social_bar.className = "card__social";
	}	
};