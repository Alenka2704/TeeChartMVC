using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web.Hosting;
using System.Web.Mvc;
using Steema.TeeChart;
using Steema.TeeChart.Styles;
using Steema.TeeChart.Tools;
using TeeChartWeb1.Models;

namespace TeeChartWeb1.Controllers
{
	public class HomeController: Controller
	{
		public ActionResult Index()
		{
			MyModel model = new MyModel();
			CreateHistogramGraph(model);
            CreateSwedenGraph(model);
            ExportToJS(model);
            return View(model);
		}
		void CreateSwedenGraph(MyModel model)
		{
			TChart myChart = new TChart();
			myChart.Walls.Back.Gradient.Visible = false;
			myChart.Walls.Back.Color = Color.White;

			myChart.Panel.Shadow.Visible = false;
			myChart.Panel.Gradient.Visible = false;

            myChart.Text = "Sweden";
			myChart.Header.Gradient.Visible = false;
			myChart.Header.Font.Gradient.Visible = false;
			myChart.Header.Font.Color = Color.Black;
			myChart.Header.Shadow.Visible = false;

			myChart.Axes.Bottom.Logarithmic = true;
			myChart.Axes.Bottom.LogarithmicBase = 10;
			myChart.Axes.Bottom.Grid.Visible = false;

			myChart.Axes.Left.Grid.Visible = false;

			Line series = (Line)myChart.Series.Add(new Line());
			//			series.GetHorizAxis.Logarithmic = true;
			//			series.GetHorizAxis.LogarithmicBase = 10;
			series.Add(0.0001, 40);
			series.Add(0.2, 40);
			series.Add(0.2, 70);
			series.Add(0.5, 70);
			series.Add(0.5, 90);
			series.Add(60, 90);

			// logarithmic axes does not work!!!!!!

			//wChart3.Series[0].FillSampleValues(); //data fill routines
			//optional - add in some custom javascript
			//setting a clientside visualisation theme
			//string[] customCode = new string[] { " chart1.applyTheme(\"minimal\");" };
			//wChart3.Export.Image.JScript.CustomCode = customCode;


			// wChart3.Export.Image.JScript.DoFullPage = false;


			//********* end client code *********************


			//p3.Pointer.Gradient.Visible = false;

			//line1.Pointer.Visible = true;
			//line2.Pointer.Visible = true;

			//p3.Pointer.Style = Steema.TeeChart.Styles.PointerStyles.Circle;

			//wChart3.Series.Add(line1);
			//wChart3.Series.Add(line2);
			//wChart3.Series.Add(p3);

			myChart.Legend.Visible = false;

            model.charts.Add(myChart);
        }

		void CreateHistogramGraph(MyModel model)
		{
			TChart graph = new TChart();
			graph.Text = "Histograms";
			graph.Panel.MarginLeft = 7;
			for (int i = 0; i < 3; i++)
			{
				Bar barSeries = (Bar)graph.Series.Add(new Bar());
                barSeries.BarWidthPercent = 110;
                barSeries.Marks.Style = MarksStyles.Value;
				barSeries.Title = "Histogram " + (i + 1);
				barSeries.CustomVertAxis = graph.Axes.Custom.Add(new Axis(false, false, graph.Chart) { StartEndPositionUnits = PositionUnits.Percent });
				barSeries.CustomVertAxis.Title.Text = "Distribution";
				barSeries.FillSampleValues(50);
			}
			graph.Axes.Custom[0].StartPosition = 0;
			graph.Axes.Custom[0].EndPosition = 32;
			graph.Axes.Custom[1].StartPosition = 34;
			graph.Axes.Custom[1].EndPosition = 66;
			graph.Axes.Custom[2].StartPosition = 68;
			graph.Axes.Custom[2].EndPosition = 100;
			graph.Axes.Bottom.Grid.Visible = true;
			graph.Axes.Bottom.Title.Text = "Voltage (V)";
			graph.Export.Image.JScript.CustomCode = System.IO.File.ReadAllLines(HostingEnvironment.MapPath("~/Scripts/graphs/histogramGraphCustomCode.js")).Select(item => item.Replace("\"barsContentsHere\"", System.Web.Helpers.Json.Encode("bar clicked: "))).ToArray();
			graph.Export.Image.JScript.BodyHTML = System.IO.File.ReadAllLines(HostingEnvironment.MapPath("~/Scripts/graphs/histogramGraphCustomHtml.html"));

            graph.Axes.Left.SetMinMax(0, 100);
            CursorTool cursor = new CursorTool(graph.Chart);
            cursor.FollowMouse = true;

            model.charts.Add(graph);
        }

        public void ExportToJS(MyModel model)
        {
            List<System.IO.MemoryStream> streams = new List<System.IO.MemoryStream>();
            System.IO.MemoryStream tempStream2 = null;
            for (var i=0; i < model.charts.Count; i++)
            {
                var chart = model.charts[i];

                //setup the Chart export stream
                tempStream2 = new System.IO.MemoryStream();
                chart.Export.Image.JScript.DoFullPage = false;
                chart.Export.Image.JScript.Width = 800; //size the Chart
                chart.Export.Image.JScript.Height = 500;
                chart.Export.Image.JScript.ChartName = chart.Text;
                chart.Export.Image.JScript.CanvasName = chart.Text;

                //build the Chart
                chart.Export.Image.JScript.Save(tempStream2); //write to stream
                tempStream2.Position = 0;

                streams.Add(tempStream2);
            }

            var page = new List<string>();
            page.Add("<html>");
            page.Add("<head>");
            page.Add("<title>My Site</title>");
            page.Add("<script src=\"https://www.steema.com/files/public/teechart/html5/latest/src/teechart.js\" type=\"text/javascript\"></script>");
            page.Add("<script src=\"/SiteScripts/EvaluationManager.js\"></script>");
            page.Add("<script type=\"text/javascript\">");
            page.Add("function createCharts(){");
            foreach (var stream in streams)
            {
                page.Add(new System.IO.StreamReader(stream).ReadToEnd());
            }
            page.Add("}");
            page.Add("</script>");
            page.Add("</head>");
            page.Add("<body onload=\"createCharts()\">");
            foreach (var chart in model.charts)
            {
                page.Add("<canvas id=\"" + chart.Export.Image.JScript.CanvasName + "\" width=\"" + chart.Export.Image.JScript.Width + "\" height=\"" + chart.Export.Image.JScript.Height + "\">");
                page.Add("This browser does not seem to support HTML5 Canvas.");
                page.Add("</canvas>");
            }
            page.Add("</body>");
            page.Add("</html>");

            model.graph = Content(string.Join(Environment.NewLine, page)).Content;
        }
    }
}