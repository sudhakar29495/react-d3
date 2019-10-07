import React from 'react';
import * as d3 from 'd3';

import './main.scss';
import Chart from '../../components/Chart';
import AreaChart from '../../components/Chart/areaChart';
import { initialBarChartData, initialAreaChartData } from '../../utils/mockData';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportDurations: ['Daily', 3, 6, 12],
      selectedReportDuration: 'Daily',
      selectedChartDatas: initialAreaChartData
    };
    window.addEventListener('resize', () => this.onResizeWindow(this.state.selectedReportDuration));
  }

  onResizeWindow = selectedReportDuration => {
    d3.selectAll('g').remove();
    d3.selectAll('path').remove();
    let newSelectedChartDatas = JSON.parse(JSON.stringify(initialBarChartData))
    if (typeof selectedReportDuration === 'number') {
      newSelectedChartDatas.forEach(selectedChartData => {
        selectedChartData.data = selectedChartData.data.slice(0, selectedReportDuration)
      });
      this.setState({
        selectedReportDuration: selectedReportDuration,
        selectedChartDatas: newSelectedChartDatas
      });
    } else {
      this.setState({
        selectedReportDuration: selectedReportDuration,
        selectedChartDatas: initialAreaChartData
      });
    }
  }

  onClickDuration = selectedReportDuration => {
    this.onResizeWindow(selectedReportDuration);
  }

  render() {
    const { reportDurations, selectedReportDuration, selectedChartDatas } = this.state;
    return (
      <main className="container-fluid main-content p-3 p-lg-4 p-xl-5">
        <nav className="nav">
          {reportDurations.map((reportDuration, index) => (
            <li
              key={reportDuration}
              className={`${selectedReportDuration === reportDuration ? 'active' : ''} c-pointer`}
              onClick={() => this.onClickDuration(reportDuration)}
            >
              {index === 0 ? reportDuration : `${reportDuration} Months`}
            </li>
          ))}
        </nav>
        <div className="row">
          {selectedChartDatas.map(chartData => (
            <div className="col-12 col-lg-6 p-3" key={chartData.name}>
              <div className="card">
                <div className="title pt-4 m-0">
                  {chartData.title}
                  <div className="d-sm-flex justify-content-between">
                    <div>
                      <span className="total">{`$${((chartData.data.map((val) => val.value)).reduce((acc, val)=> acc+val)/1000).toFixed(2)}K`}</span>
                      <span className="mx-2">Average</span>
                      <span className="average">{`$${((chartData.data.map((val) => val.value)).reduce((acc, val)=> acc+val)/chartData.data.length/1000).toFixed(2)}K`}</span>
                    </div>
                    {selectedReportDuration !== 'Daily' &&
                      <div className="position-relative">
                        <div className="growth-rate">Growth Rate</div>
                      </div>
                    }
                  </div>
                </div>
                {selectedReportDuration === 'Daily' ?
                  <AreaChart
                    chartData={chartData}
                  />
                  :
                  <Chart
                    chartData={chartData}
                  />
                }
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }
}

export default Main;
