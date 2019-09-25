var number_selector = document.getElementById('selector');
localStorage.setItem("number", "5");
number_selector.onchange = function (argument) {
  var number = number_selector.options[number_selector.selectedIndex].value; 
  localStorage.setItem("number", number);
  console.log("updating num of memes");
  console.log(localStorage.number);
}

