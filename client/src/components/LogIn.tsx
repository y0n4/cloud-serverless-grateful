import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h1>😊 Please log in 😊</h1>

        <Button onClick={this.onLogin} size="huge" color="brown">
          Log in
        </Button>
      </div>
    )
  }
}
