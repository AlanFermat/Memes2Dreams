// write word data to dom
let chart = document.getElementById('bar_chart');
var ref = window.meme;


var options = {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		}
	};

var data = {
		labels: [],
		datasets: [{
			label: '# of Memes',
			data: [],
			backgroundColor: '#b594bf',
			borderWidth: 1
		}]};

for (var key in ref) {
	data.labels.push(key);
	data.datasets[0].data.push(ref[key]);
}

var report_chart = new Chart(chart, {
	type: 'bar',
	data: data,
	options: options
	
});