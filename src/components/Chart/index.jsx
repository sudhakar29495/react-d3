import React from 'react';
import * as d3 from 'd3';
import './chart.scss';

class Chart extends React.Component {
  constructor() {
    super();
    this.sectionRef = React.createRef();
  }

  componentDidMount() {
    const { name : id, data } = this.props.chartData;
    this.renderChart(id, data);
  }

  shouldComponentUpdate(nextProps) {
    const { name : id, data } = nextProps.chartData;
    this.renderChart(id, data);
    return true;
  }

  renderChart = (id, chartData) => {
    this.svg = d3.select(`#${id}`);
    const margin = 50;
    const width = Number(this.sectionRef.current.offsetWidth) - 2 * margin;
    const height = Number(this.sectionRef.current.offsetHeight) - 2 * margin;
    const chart = this.svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(chartData.map((s) => s.month))
      .padding(0.4)
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(chartData, (d) => (d.value))]);
    const makeYLines = () => d3.axisLeft(yScale);
    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));
    chart.append('g')
      .attr('class', 'grid')
      .call(makeYLines().tickSize(-width, 0, 0).tickFormat(a => `${Math.floor(a / 1000)}K`))
    const barGroups = chart.selectAll()
      .data(chartData)
      .enter()
      .append('g')
      .data(chartData)
    barGroups
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (g) => chartData.length === 3 ? xScale(g.month) : 0)
      .attr('y', (d) => chartData.length === 3 ? height : height - d.value / (d3.max(chartData, (d) => (d.value)) / height))
      .attr("height", (d) => chartData.length === 3 ? 0 : d.value / height)
      .attr('width', chartData.length === 3 ? xScale.bandwidth() : 0)
      .on('mouseenter', (actual) => {
        let tooltip = d3.select(`#section_${id}`).append("div").attr("class", "tooltip");
        tooltip.html(`<span>${actual.month}</span><br/>$${actual.value}`)
          .style("top", yScale(actual.value) + 30 + "px")
          .style("left",xScale(actual.month) + xScale.bandwidth()*3 / 4 + "px");
      })
      .on('mouseleave', () => {
        d3.select(`.tooltip`).remove();
      });
    if(chartData.length === 3) {
      d3.selectAll('rect')
        .transition().duration(1000)
        .attr('y', (d) => { return height - d.value / (d3.max(chartData, (d) => (d.value)) / height); })
        .attr("height", (d) => { return d.value / height; });
    } else {
      d3.selectAll('rect')
        .transition()
        .duration(1000)
        .attr('x', (g) => xScale(g.month))
        .attr('width', xScale.bandwidth())
    }

    // Drawing line chart over bar
    this.customLineChart(margin, width, height, chartData);
  }

  customLineChart = (margin, width, height, chartData) => {
    const transX = chartData.length === 3 ? -1.5 : 1;
    const transY = chartData.length === 3 ? 3 : 2;
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    x.domain([0, d3.max(chartData, (d) => { return d.monthCount })]);
    y.domain([0, d3.max(chartData, (d) => { return d.value })]);
    const path = this.svg.selectAll(".line").data([chartData]);
    path.enter()
      .append("path")
      .attr("class", "line")
      .merge(path)
      .attr("d", d3.line()
        .x((d) => { return x(0); })
        .y((d) => { return y(d.value); })
      )
      .attr('transform', `translate(${(margin / 2) * transX}, ${margin * transY})`)
      .attr("fill", "none")
      .attr("stroke", "#433582")
      .attr("stroke-width", 2)
      d3.selectAll('.line')
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x((d) => { return x(d.monthCount); })
        .y((d) => { return y(d.value); })
      );
  }

  render() {
    const { name: id } = this.props.chartData;
    return (
      <section className="chart-card" ref={this.sectionRef} id={`section_${id}`}>
        <svg id={id}></svg>
      </section>
    );
  }
}

export default Chart;