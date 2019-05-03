$(JSLINQ(chart1.axes.items).Where(function (item1) { return item1.horizontal; }).items).each(function () {
	this.labels.dateFormat = "dd'.'mm'.'yyyy\nHH:MM";
	this.labels.wordWrap = "yes";
});

var axesOn = false;
$('#axes-btn').click(function () {
	axesOn = !axesOn;
	if (axesOn) {
		chart1.axes.items[3].visible = false;
		$(JSLINQ(chart1.axes.items).Where(function (item1) { return item1.horizontal && item1.title.text.indexOf("_") > -1; }).items).each(function () {
			this.visible = true;
		});
		$(JSLINQ(chart1.series.items).items).each(function () {
			var that = this;
			that.horizAxis = $(JSLINQ(chart1.axes.items).Where(function (item1) {
				return item1.horizontal && that.title.indexOf("_") > -1 && that.title.substring(that.title.indexOf("_") + 1) == item1.title.text.substring(item1.title.text.indexOf("_") + 1);
			}))[0].items[0];
		});
	}
	else {
		$(JSLINQ(chart1.axes.items).Where(function (item1) { return item1.horizontal; }).items).each(function () {
			this.visible = false;
		});
		chart1.axes.items[3].visible = true;
		$(JSLINQ(chart1.series.items).items).each(function () {
			this.horizAxis = "bottom";
		});
	}
	chart1.draw();
});

$(document).ready(() => {
	var body = $(document.body)[0];
	var canvas = body.getElementsByTagName("canvas")[1];
	canvas.remove();
	chart1.draw();
});