import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Route, Switch, Router} from 'react-router-dom'
import PropTypes from 'prop-types'
import history from './history'
import {Main, Login, Signup, Board, MainMenu, Rules, WaitingRoom} from './components'
import {me} from './store'


/**
 * COMPONENT
 */
class Routes extends Component {
  // componentDidMount () {
  //   this.props.loadInitialData()
  // }
  // FIX TOMORROW!!!!

  render () {
    const {isLoggedIn} = this.props

    return (
      <Router history={history}>
        <Main>
          <Switch>
          <Route exact path="/" component={MainMenu} />
          <Route exact path="/game/:currentGame" component={Board} />
          <Route path="/rules" component={Rules} />
          <Route exact path="/waitingroom/:currentGame" component={WaitingRoom} />
            {/* Routes placed here are available to all visitors */}
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            {
              isLoggedIn &&
                <Switch>
                  {/* Routes placed here are only available after logging in */}
                  <Route path="/home" component={MainMenu} />
                </Switch>
            }
            {/* Displays our MainMenu component as a fallback */}
            <Route exact path="/" component={MainMenu} />
          </Switch>
        </Main>
      </Router>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData () {
      dispatch(me())
    }
  }
}

export default connect(mapState, mapDispatch)(Routes)

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
