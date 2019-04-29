function resize(chart) {
	if (chart != null) {
		var div = $("#histogramsCanvasDiv");
		var w = div.width();
		var h = div.height();
		var canvas = chart.canvas;
		canvas.setAttribute("width", "" + w + "px");
		canvas.setAttribute("height", "" + h-3 + "px");
		chart.bounds.width = w;
        chart.bounds.height = h;
        
        var leftAxes = [];
        leftAxes.maxTicksLength = 0;
        leftAxes.maxLabelWidth = 0;
        leftAxes.maxTitleHeight = 0;
        var rightAxes = [];
        rightAxes.maxTicksLength = 0;
        rightAxes.maxLabelWidth = 0;
        rightAxes.maxTitleHeight = 0;
        for (var i = 4; i < chart1.axes.items.length; i+=2) {
            axis = chart.axes.items[i];
            leftAxes.maxTicksLength = Math.max(leftAxes.maxTicksLength, axis.ticks.length);
            leftAxes.maxLabelWidth = Math.max(leftAxes.maxLabelWidth, axis.minmaxLabelWidth(true));
            leftAxes.maxTitleHeight = Math.max(leftAxes.maxTitleHeight, axis.title.bounds.height);

            axis = chart.axes.items[i+1];
            rightAxes.maxTicksLength = Math.max(rightAxes.maxTicksLength, axis.ticks.length);
            rightAxes.maxLabelWidth = Math.max(rightAxes.maxLabelWidth, axis.minmaxLabelWidth(true));
            rightAxes.maxTitleHeight = Math.max(rightAxes.maxTitleHeight, axis.title.bounds.height);
        }

        var leftTitle = chart.tools.items[1], rightTitle = chart.tools.items[0];
        chart.panel.margins.left = (leftTitle.bounds.height + leftAxes.maxTicksLength + leftAxes.maxLabelWidth + leftAxes.maxTitleHeight + 20) * 100 / w;
        chart.legend.padding = (rightTitle.bounds.height + rightAxes.maxTicksLength + rightAxes.maxLabelWidth + rightAxes.maxTitleHeight + 20) * 100 / w;

        chart.draw();

        leftTitle.position.x = chart.chartRect.x - leftTitle.bounds.height - leftAxes.maxTicksLength - leftAxes.maxLabelWidth - leftAxes.maxTitleHeight - 10;
        leftTitle.position.y = chart.chartRect.y + chart.chartRect.height / 2 + leftTitle.bounds.width / 2;
        rightTitle.position.x = chart.chartRect.getRight() + rightTitle.bounds.height + rightAxes.maxTicksLength + rightAxes.maxLabelWidth + rightAxes.maxTitleHeight + 10;
        rightTitle.position.y = chart.chartRect.y + chart.chartRect.height / 2 - rightTitle.bounds.width / 2;

		chart.draw();
	}
}