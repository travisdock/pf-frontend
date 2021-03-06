import React from 'react';

import { connect } from 'react-redux';
import {Redirect } from 'react-router';
import { Route } from 'react-router';

import InputForm from '../components/InputForm';
import Chart from '../components/Chart';
import Table from '../components/Table';
import ImportPage from '../components/ImportPage';
import Settings from '../components/Settings';

export class Dashboard extends React.Component {
  render() {
    return (
      <div className="content">
        { !this.props.current_user.user_id ? <Redirect to='/login' /> : null }
        <Route path={`${this.props.match.url}/form`} component={InputForm} />
        <Route path={`${this.props.match.url}/charts`} component={Chart} />
        <Route path={`${this.props.match.url}/entries`} component={Table} />
        <Route path={`${this.props.match.url}/import`} component={ImportPage} />
        <Route path={`${this.props.match.url}/settings`} component={Settings} />
        <Route exact path={`${this.props.match.url}`} component={InputForm} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  current_user: state.current_user
});

export default connect(mapStateToProps)(Dashboard);
