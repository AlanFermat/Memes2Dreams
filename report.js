// write word data to dom
var len, charlist_html;
let charlist = document.getElementById('charlist');
console.log(charlist);
charlist_html = '';
var ref = window.meme;
for (var keyword in ref) {
    console.log(keyword, ref[keyword]);
    console.log(charlist_html);
    charlist_html += '<li><span class="char">' + keyword + '</span> <span class="charchance">' + ref[keyword] + '</span></li>';
}

charlist.innerHTML = charlist_html;

