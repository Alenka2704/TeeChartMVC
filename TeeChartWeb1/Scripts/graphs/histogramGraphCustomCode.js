var evaluationManager = new EvaluationManager({
});
var barsContents = "barsContentsHere", i;
console.log("Histograms script");
var hover = -1;
for (i = 4; i < Histograms.axes.items.length; i ++) {
    Histograms.axes.items[i].labels.decimals = 0;
    Histograms.series.items[i - 4].cursor = "pointer";
	Histograms.series.items[i - 4].onclick = function (series, index, x, y) {
        evaluationManager.fillRecordsInfo(barsContents + index);
        if (hover !== index) {
            series.hover.enabled = true;
            Histograms.draw();
            series.hover.enabled = false;
        }
        else {
            Histograms.draw();
        }
        hover = index;
	}
}
Histograms.mousedown = function (event) {
    var mousePos = [];
    Histograms.calcMouse(event, mousePos);
    for (var seriesIndex = Histograms.series.items.length - 1; seriesIndex >= 0; seriesIndex--) {
        var series = Histograms.series.items[seriesIndex];
        for (var valueIndex = series.data.values.length - 1; valueIndex >= 0 ; valueIndex--) {
            if (!series.isNull(valueIndex)) {
                var markPos = [];
                var inv = series.markPos(valueIndex, markPos);
                if (series.marks.canDraw(markPos.x, markPos.y, valueIndex, inv)) {
                    if (series.marks.clicked(mousePos)) {
                        console.log("series " + seriesIndex + ", mark " + valueIndex + " clicked");
                        return;
                    }
                }
            }
            
        }
    }
}

Histograms.legend.oldDrawSymbol = Histograms.legend.drawSymbol;
Histograms.legend.drawSymbol = function (series, index, itemPos) {
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

for (i = 4; i < Histograms.axes.items.length; i++) {
    if (Histograms.axes.items[i].format.stroke.fill === "") {
        Histograms.axes.items[i].format.stroke.oldFill = Histograms.axes.items[i].format.stroke.fill;
        Histograms.axes.items[i].format.stroke.fill = "black";
    }

    Histograms.axes.items[i].oldDrawAxis = Histograms.axes.items[i].drawAxis;
    Histograms.axes.items[i].drawAxis = newDrawAxis;
}

Histograms.axes.items[4].minLine = true;
Histograms.axes.items[5].minLine = true;

var drawTitle = function () {
    if (this.rotation === undefined || this.rotation === 0) {
        this.resize();
        this.doDraw();
    }
    else {
        //console.log(this);
        var ctx = Histograms.ctx;
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

Histograms.panel.margins.left = 12;
var leftTitle = new Tee.Annotation(Histograms);
leftTitle.format.font.style = Histograms.axes.items[Histograms.axes.items.length - 1].title.format.font.style;
leftTitle.padding = 4;
leftTitle.transparent = true;
leftTitle.rotation = 90;
leftTitle.format.font.textAlign = "center";
leftTitle.position.x = 15;
leftTitle.position.y = 300;
leftTitle.text = "Left axes description";

Histograms.tools.add(leftTitle);
leftTitle.forceDraw = drawTitle;

var rightTitle = new Tee.Annotation(Histograms);
rightTitle.format.font.style = Histograms.axes.items[Histograms.axes.items.length - 1].title.format.font.style;
rightTitle.padding = 4;
rightTitle.transparent = true;
rightTitle.rotation = -90;
rightTitle.format.font.textAlign = "center";
rightTitle.position.x = 700;
rightTitle.position.y = 50;
rightTitle.text = "Long description for the right side of the chart";

Histograms.tools.add(rightTitle);
rightTitle.forceDraw = drawTitle;

Histograms.legend.padding = 10;

Histograms.draw();

axis = Histograms.axes.items[Histograms.axes.items.length - 1];
leftTitle.position.x = Histograms.chartRect.x - leftTitle.bounds.height - axis.ticks.length - axis.minmaxLabelWidth(true) - axis.title.bounds.height - 10;
leftTitle.position.y = Histograms.chartRect.y + Histograms.chartRect.height / 2 + leftTitle.bounds.width / 2;

rightTitle.position.x = Histograms.chartRect.getRight() + rightTitle.bounds.height + 20;
rightTitle.position.y = Histograms.chartRect.y + Histograms.chartRect.height / 2 - rightTitle.bounds.width / 2;

Histograms.tools.items[0] = Histograms.tools.items[Histograms.tools.items.length - 1];
Histograms.tools.items[Histograms.tools.items.length - 1] = cursor1;

cursor1.vertAxis = null;