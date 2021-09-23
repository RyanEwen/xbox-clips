import Button from '@material-ui/core/Button'
import { withSnackbar } from 'notistack'
import React from "react"
import { withRouter } from "react-router-dom"

export const AppContext = React.createContext()

class AppContextProvider extends React.Component {
    state = {
        gamertag: null,
    }

    constructor(props) {
        super(props)

        const { match: { url } } = props

        this.paths = {
            root: `${url}`,
            clips: `${url}/clips`,
            screenshots: `${url}/screenshots`,
        }
    }

    setGamertag = (gamertag) => {
        this.setState({
            gamertag,
        })
    }

    showMessage = (msg, options) => {
        this.props.enqueueSnackbar(msg, {
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            ...options,
        })
    }

    showError = (err, options) => {
        this.showMessage(err.message || err, {
            variant: 'error',
            persist: true,
            style: { whiteSpace: 'pre-line' },
            // eslint-disable-next-line react/display-name
            action: (key) => <Button onClick={() => { this.props.closeSnackbar(key) }}>Dismiss</Button>,
            ...options,
        })
    }

    closeSnackbar = this.props.closeSnackbar

    render() {
        return (
            <AppContext.Provider
                value={{
                    ...this.state,
                    setGamertag: this.setGamertag,
                    showMessage: this.showMessage,
                    showError: this.showError,
                    closeSnackbar: this.closeSnackbar,
                    paths: this.paths,
                }}
            >
                {this.props.children}
            </AppContext.Provider>
        )
    }
}

export default withRouter(withSnackbar(AppContextProvider))

export function withAppContext(Component) {
    return function contextComponent(props) {
        return (
            <AppContext.Consumer>
                {context => <Component {...props} {...context} />}
            </AppContext.Consumer>
        )
    }
}
