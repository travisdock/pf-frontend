import React from 'react';
import {bb} from "billboard.js";
import { connect } from 'react-redux';

class Chart extends React.Component {

  state = {
    charts: {},
    load: false,
    toggleChart: false,
    currentChart: 0
  }

  componentDidMount() {
    const id = this.props.current_user.user_id

    fetch(`https://sumfinance.herokuapp.com/api/v1/charts/${id}`)
      .then(resp => resp.json())
      .then(resp => {if (resp.error) {
        this.setState({error: true})
      } else {
        this.setState({charts: resp, load: true, currentChart: resp.pie_data.length - 2 }, this.renderPieChart)
      }}
        )
  }

  changePieChart = () => {
    const max = this.state.charts.pie_data.length
    this.setState((prevState) => {
      return {
        currentChart: (prevState.currentChart === (max - 1) ? 0 : prevState.currentChart + 1)
      }
    }, this.renderPieChart)
  }

  changeChart = () => {
    (this.state.toggleChart ? this.renderPieChart() : this.renderPLChart());
    this.setState((prevState) => {return {toggleChart: !prevState.toggleChart}})
  }

  renderPieChart() {
    const { currentChart } = this.state
    const { pie_data } = this.state.charts
    const month = Object.keys(pie_data[currentChart])[0]

    bb.generate({
      data: {
        columns: pie_data[currentChart][month],
        type: "pie"
      },
      title: {
        text: month,
        position: "top-center",
        padding: {
            top: 10,
           right: 10,
            bottom: 10,
            left: 10
        }
      },
      bindto: "#chart"
    });
  }

  renderPLChart() {
    bb.generate({
      data: {
        x: "x",
        columns: this.state.charts.p_l,
      type: "area-spline"
      },
      axis: {
        x: {
          type: "timeseries",
          tick: {
            format: "%b"
          }
        }
      },
      bindto: "#chart"
    });
  }

  render() {
    return (
      <div className="chart-content">
        {this.state.load ?
            <div className="chart-content">
              <button onClick={this.changeChart}>Change Chart</button>
              <div id="chart" />
              {this.state.toggleChart ?
                null :
                <button onClick={this.changePieChart}>Next</button>
              }
            </div> :
            this.state.error ? <div>No Entries</div> : <div>Loading...</div>
        }
      </div>
    )
  }
}
const mapStateToProps = state => ({
  current_user: state.current_user
});

export default connect(mapStateToProps)(Chart)