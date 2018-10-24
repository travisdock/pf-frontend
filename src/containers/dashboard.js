import React from 'react';

import { connect } from 'react-redux';
import {Redirect } from 'react-router';
import { Route } from 'react-router';

import InputForm from '../components/input_form';
import Chart from '../components/chart';
import Table from '../components/table';

class Dashboard extends React.Component {
  render() {
    return (
      <div className="content">
        { !this.props.current_user.user_id ? <Redirect to='/login' /> : null }
        <Route path={`${this.props.match.url}/form`} component={InputForm} />
        <Route path={`${this.props.match.url}/charts`} component={Chart} />
        <Route path={`${this.props.match.url}/entries`} component={Table} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  current_user: state.current_user
});

export default connect(mapStateToProps)(Dashboard);
