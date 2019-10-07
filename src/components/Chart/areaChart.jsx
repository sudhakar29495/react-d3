import React from 'react';
import * as d3 from 'd3';
import { formatMonth } from '../../utils/mockData';

class AreaChart extends React.Component {

  constructor() {
    super();
    this.sectionRef = React.createRef();
  }

  componentDidMount() {
    const { name: id, data : chartData } = this.props.chartData;
    this.renderChart(id, chartData);
  }

  shouldComponentUpdate(nextProps) {
    const { name : id, data : chartData } = nextProps.chartData;
    this.renderChart(id, chartData);
    return true;
  }

  renderChart = (id, chartData) => {
    const weekdays = chartData.filter(s => new Date(s.date).getDay() === 1);
    this.svg = d3.select(`#${id}`);
    const margin = 50;
    const width = Number(this.sectionRef.current.offsetWidth) - 2 * margin;
    const height = Number(this.sectionRef.current.offsetHeight) - 2 * margin;
    const chart = this.svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(weekdays.map((s) => {
        return s.date;
      }))
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(chartData, (d) => (d.value))]);
    const makeYLines = () => d3.axisLeft(yScale);
    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3.axisBottom(xScale)
          .tickFormat(a => `${formatMonth(new Date(a).getMonth())} ${new Date(a).getDate()}`)
      );
    chart.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat(a => `${Math.floor(a / 1000)}K`)
      );
    // Drawing the areas to be covered based on data
    this.customAreaChart(margin, width, height, chartData, yScale, id);
  }

  customAreaChart = (margin, width, height, chartData, yScale, id) => {
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    x.domain([0, d3.max(chartData, (d, i) => i )]);
    y.domain([0, d3.max(chartData, (d) => d.value )]);
    const path = this.svg.selectAll(".line").data([chartData]);
    path.enter()
      .append("path")
      .attr("class", "areaLine")
      .merge(path)
      .attr("d", d3.area()
        .x((d, i) => {
          d3.select('.areaLine')
          const tooltip = d3.select(`#section_${id}`).append("div").attr("class", "area-tooltip");
          tooltip.html(`<span>${formatMonth(new Date(d.date).getMonth())} ${new Date(d.date).getDate()}</span><br/>$${d.value}`)
            .style("top", yScale(d.value) + margin / 2 + 15 + "px")
            .style("left", x(i) + margin / 2 + "px")
          return x(i);
        })
        .y0(height)
        .y1((d) => y(d.value))
      )
      .attr('transform', `translate(${(margin)}, ${margin})`)
      .attr("fill", "#fbdfc8")
      const linePath = this.svg.selectAll(".line").data([chartData]);
    linePath.enter()
      .append("path")
      .attr("class", "line")
      .merge(linePath)
      .attr("d", d3.line()
        .x((d, i) => { return x(i); })
        .y((d) => { return y(d.value); })
      )
      .attr('transform', `translate(${margin}, ${margin})`)
      .attr("fill", "none")
      .attr("stroke", "#fda65a")
      .attr("stroke-width", 2)
  }
  render() {
    const { name : id } = this.props.chartData;
    return (
      <section className="chart-card" ref={this.sectionRef} id={`section_${id}`}>
        <svg id={id}></svg>
      </section>
    );
  };
}

export default AreaChart;