var evaluationManager = new EvaluationManager({
});
var barsContents = "barsContentsHere";
console.log("chart1 script");
var hover = -1;
var phase = -1;
for (var i = 4; i < chart1.axes.items.length; i +=2) {
    chart1.axes.items[i].labels.decimals = 0;
    chart1.series.items[i - 4].cursor = "pointer";
	chart1.series.items[i - 4].onclick = function (series, index, x, y) {
		if (hover !== index || chart1.series.items.indexOf(series) != phase) {
			series.hover.enabled = true;
			chart1.draw();
			series.hover.enabled = false;
		}
		else {
			chart1.draw();
		}
		hover = index;
		phase = chart1.series.items.indexOf(series) / 2;
        evaluationManager.fillRecordsInfo(barsContents+phase + index);
	}
}
chart1.mousedown = function (event) {
    var mousePos = [];
    chart1.calcMouse(event, mousePos);
    for (var seriesIndex = chart1.series.items.length - 1; seriesIndex >= 0; seriesIndex--) {
        var series = chart1.series.items[seriesIndex];
        for (var valueIndex = series.data.values.length - 1; valueIndex >= 0 ; valueIndex--) {
            if (!series.isNull(valueIndex)) {
                var markPos = [];
                var inv = series.markPos(valueIndex, markPos);
                if (series.marks.canDraw(markPos.x, markPos.y, valueIndex, inv)) {
                    if (series.marks.clicked(mousePos)) {
						evaluationManager.fillRecordsInfo(barsContents + phase + valueIndex);
						if (hover !== valueIndex || chart1.series.items.indexOf(series) != phase) {
							series.hover.enabled = true;
							chart1.draw();
							series.hover.enabled = false;
						}
						else {
							chart1.draw();
						}
						hover = valueIndex;
						phase = chart1.series.items.indexOf(series) / 2;
						return;
                    }
                }
            }            
        }
    }
}

chart1.legend.oldDrawSymbol = chart1.legend.drawSymbol;
chart1.legend.drawSymbol = function (series, index, itemPos) {
    if (series instanceof Tee.Line) {
        this.symbol.style = "line";
    }
    else if (series instanceof Tee.Bar) {
        this.symbol.style = "rectangle";
    }

    this.oldDrawSymbol(series, index, itemPos);
}

function newDrawAxis() {
    var t = this, f = t.format, c = t.chart.ctx;
    if (f.stroke.oldFill !== "") {
        this.oldDrawAxis();
    }

    if (this.minLine || this.maxLine) {
        var start, end, pos;

        c.z = this.z;

        c.beginPath();

        if (t.horizontal) {
            start = t.chart.chartRect.y;
            end = t.chart.chartRect.getBottom();
            if (this.minLine) {
                pos = t.calc(t.minimum);
                c.moveTo(pos, start);
                c.lineTo(pos, end);
            }
            if (this.maxLine) {
                pos = t.calc(t.maximum);
                c.moveTo(pos, start);
                c.lineTo(pos, end);
            }
        } else {
            start = t.chart.chartRect.x;
            end = t.chart.chartRect.getRight();
            if (this.minLine) {
                pos = t.calc(t.minimum);
                c.moveTo(start, pos);
                c.lineTo(end, pos);
            }
            if (this.maxLine) {
                pos = t.calc(t.maximum);
                c.moveTo(start, pos);
                c.lineTo(end, pos);
            }
        }

        f.stroke.prepare();
        c.stroke();
    }
}

for (i = 4; i < chart1.axes.items.length; i++) {
    if (chart1.axes.items[i].format.stroke.fill === "") {
        chart1.axes.items[i].format.stroke.oldFill = chart1.axes.items[i].format.stroke.fill;
        chart1.axes.items[i].format.stroke.fill = "black";
    }

    chart1.axes.items[i].oldDrawAxis = chart1.axes.items[i].drawAxis;
    chart1.axes.items[i].drawAxis = newDrawAxis;
}

chart1.axes.items[4].minLine = true;
chart1.axes.items[5].minLine = true;

var drawTitle = function () {
    if (this.rotation === undefined || this.rotation === 0) {
        this.resize();
        this.doDraw();
    }
    else {
        //console.log(this);
        var ctx = chart1.ctx;
        ctx.save();
        this.position.oldX = this.position.x;
        this.position.oldY = this.position.y;

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(-this.rotation * Math.PI / 180);

        this.position.x = 0;
        this.position.y = 0;

        this.resize();
        this.doDraw();

        ctx.restore();
        this.position.x = this.position.oldX;
        this.position.y = this.position.oldY;
    }
}

chart1.panel.margins.left = 12;
var leftTitle = new Tee.Annotation(chart1);
leftTitle.format.font.style = chart1.axes.items[chart1.axes.items.length - 1].title.format.font.style;
leftTitle.padding = 4;
leftTitle.transparent = true;
leftTitle.rotation = 90;
leftTitle.format.font.textAlign = "center";
leftTitle.position.x = 15;
leftTitle.position.y = 300;
leftTitle.text = "Left axes description";

chart1.tools.add(leftTitle);
leftTitle.forceDraw = drawTitle;

var rightTitle = new Tee.Annotation(chart1);
rightTitle.format.font.style = chart1.axes.items[chart1.axes.items.length - 1].title.format.font.style;
rightTitle.padding = 4;
rightTitle.transparent = true;
rightTitle.rotation = -90;
rightTitle.format.font.textAlign = "center";
rightTitle.position.x = 700;
rightTitle.position.y = 50;
rightTitle.text = "Long description for the right side of the chart";

chart1.tools.add(rightTitle);
rightTitle.forceDraw = drawTitle;

chart1.legend.padding = 10;

chart1.draw();

axis = chart1.axes.items[chart1.axes.items.length - 1];
leftTitle.position.x = chart1.chartRect.x - leftTitle.bounds.height - axis.ticks.length - axis.minmaxLabelWidth(true) - axis.title.bounds.height - 10;
leftTitle.position.y = chart1.chartRect.y + chart1.chartRect.height / 2 + leftTitle.bounds.width / 2;

rightTitle.position.x = chart1.chartRect.getRight() + rightTitle.bounds.height + 20;
rightTitle.position.y = chart1.chartRect.y + chart1.chartRect.height / 2 - rightTitle.bounds.width / 2;

chart1.tools.items[0] = chart1.tools.items[chart1.tools.items.length - 1];
chart1.tools.items[chart1.tools.items.length - 1] = cursor1;

cursor1.vertAxis = null;
this.resize(chart1);

$(document).ready(() => {
	var body = $(document.body)[0];
	var canvas = body.getElementsByTagName("canvas")[1];
	canvas.remove();
});