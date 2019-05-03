function resize(chart) {
	if (chart != null) {
		var div = $('#timelineCanvasDiv');
		var w = div.width();
		var h = div.height();
		var canvas = chart.canvas;
		canvas.setAttribute('width', "" + w + "px");
		canvas.setAttribute('height', "" + h + "px");
		chart.bounds.width = w;
		chart.bounds.height = h;
		chart.draw();
	}
}