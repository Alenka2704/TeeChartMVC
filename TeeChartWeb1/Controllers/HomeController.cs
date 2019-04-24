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
			var tempStream2 = new System.IO.MemoryStream();
			myChart.Export.Image.JScript.Width = 800; //size the Chart
			myChart.Export.Image.JScript.Height = 300;
			//build the Chart
			myChart.Export.Image.JScript.Save(tempStream2); //write to stream
			tempStream2.Position = 0;
			model.graph = Content((new System.IO.StreamReader(tempStream2)).ReadToEnd()).Content;
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
				barSeries.FillSampleValues(20);

				Line lineSeries = (Line)graph.Series.Add(new Line());
				lineSeries.CustomVertAxis = graph.Axes.Custom.Add(new Axis(false, true, graph.Chart) { StartEndPositionUnits = PositionUnits.Percent });
				lineSeries.CustomVertAxis.Title.Text = "Cumulative";
				lineSeries.FillSampleValues(20);
			}
			graph.Axes.Custom[0].StartPosition = graph.Axes.Custom[1].StartPosition = 0;
			graph.Axes.Custom[0].EndPosition = graph.Axes.Custom[1].EndPosition = 32;
			graph.Axes.Custom[2].StartPosition = graph.Axes.Custom[3].StartPosition = 34;
			graph.Axes.Custom[2].EndPosition = graph.Axes.Custom[3].EndPosition = 66;
			graph.Axes.Custom[4].StartPosition = graph.Axes.Custom[5].StartPosition = 68;
			graph.Axes.Custom[4].EndPosition = graph.Axes.Custom[5].EndPosition = 100;
			graph.Axes.Bottom.Grid.Visible = true;
			graph.Axes.Bottom.Title.Text = "Voltage (V)";
			graph.Export.Image.JScript.CustomCode = System.IO.File.ReadAllLines(HostingEnvironment.MapPath("~/Scripts/graphs/histogramGraphCustomCode.js")).Select(item => item.Replace("\"barsContentsHere\"", System.Web.Helpers.Json.Encode("bar clicked: "))).ToArray();
			graph.Export.Image.JScript.BodyHTML = System.IO.File.ReadAllLines(HostingEnvironment.MapPath("~/Scripts/graphs/histogramGraphCustomHtml.html"));
			graph.Export.Image.JScript.ExternalCode = System.IO.File.ReadAllLines(HostingEnvironment.MapPath("~/Scripts/graphs/histogramGraphExternalCode.js"));

			graph.Axes.Left.SetMinMax(0, 100);
			CursorTool cursor = new CursorTool(graph.Chart);
			cursor.FollowMouse = true;

			var tempStream2 = new System.IO.MemoryStream();
			graph.Export.Image.JScript.Width = 1500; //size the Chart
			graph.Export.Image.JScript.Height = 800;
			//build the Chart
			graph.Export.Image.JScript.Save(tempStream2); //write to stream
			tempStream2.Position = 0;
			model.graph = Content((new System.IO.StreamReader(tempStream2)).ReadToEnd()).Content;
		}
	}
}