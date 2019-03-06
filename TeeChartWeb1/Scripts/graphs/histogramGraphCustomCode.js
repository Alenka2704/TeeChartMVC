var evaluationManager = new EvaluationManager({
});
var barsContents = "barsContentsHere";
console.log("histogram script");
for (var i = 4; i < chart1.axes.items.length; i ++) {
	chart1.axes.items[i].labels.decimals = 0;
	chart1.series.items[i - 4].onclick = function (series, index, x, y) {
		evaluationManager.fillRecordsInfo(barsContents+index);
	}
}