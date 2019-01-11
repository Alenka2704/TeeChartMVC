using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TeeChartWeb1.Models;

namespace TeeChartWeb1.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			MyModel model = new MyModel();
			CreateSwedenGraph(model);
			return View(model);
		}
		void CreateSwedenGraph(MyModel model)
		{
			Steema.TeeChart.TChart myChart = new Steema.TeeChart.TChart();
			myChart.Walls.Back.Gradient.Visible = false;
			myChart.Walls.Back.Color = Color.White;

			myChart.Panel.Shadow.Visible = false;
			myChart.Panel.Gradient.Visible = false;

			myChart.Text = "";
			myChart.Header.Gradient.Visible = false;
			myChart.Header.Font.Gradient.Visible = false;
			myChart.Header.Font.Color = Color.Black;
			myChart.Header.Shadow.Visible = false;

			myChart.Axes.Bottom.Logarithmic = true;
			myChart.Axes.Bottom.LogarithmicBase = 10;
			myChart.Axes.Bottom.Grid.Visible = false;

			myChart.Axes.Left.Grid.Visible = false;

			Steema.TeeChart.Styles.Line series = (Steema.TeeChart.Styles.Line)myChart.Series.Add(new Steema.TeeChart.Styles.Line());
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


			//			wChart3.Export.Image.JScript.CustomCode = System.IO.File.ReadAllLines(HostingEnvironment.MapPath("~/Scripts/graphs/swedenGraphCustomCode.js"));
			//			wChart3.Export.Image.JScript.ExternalCode = System.IO.File.ReadAllLines(HostingEnvironment.MapPath("~/Scripts/graphs/swedenGraphExternalCode.js"));
			//			wChart3.Export.Image.JScript.BodyHTML = System.IO.File.ReadAllLines(HostingEnvironment.MapPath("~/Views/graphsHtml/swedenGraphExternalHtml.html"));

			//setup the Chart export stream
			var tempStream2 = new System.IO.MemoryStream();
			myChart.Export.Image.JScript.Width = 800; //size the Chart
			myChart.Export.Image.JScript.Height = 300;
			//build the Chart
			myChart.Export.Image.JScript.Save(tempStream2); //write to stream
			tempStream2.Position = 0;
			model.graph = Content((new System.IO.StreamReader(tempStream2)).ReadToEnd()).Content;
		}
	}
}