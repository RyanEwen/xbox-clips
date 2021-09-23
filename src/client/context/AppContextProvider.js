import Button from '@material-ui/core/Button'
import { withSnackbar } from 'notistack'
import React from "react"
import { generatePath } from 'react-router'
import { withRouter } from "react-router-dom"

export const AppContext = React.createContext()

class AppContextProvider extends React.Component {
    state = {
        gamertag: null,
        paths: null,
    }

    componentDidMount = () => {
        const { url, params } = this.props.match

        this.setState({
            gamertag: params.gamertag,
            paths: {
                root: `${url}`,
                clips: `${url}/clips`,
                screenshots: `${url}/screenshots`,
            },
        })
    }

    componentDidUpdate(prevProps) {
        const { url: oldUrl } = prevProps.match
        const { url, params } = this.props.match

        if (url != oldUrl) {
            this.setState({
                gamertag: params.gamertag,
                paths: {
                    root: `${url}`,
                    clips: `${url}/clips`,
                    screenshots: `${url}/screenshots`,
                },
            })
        }
    }

    setGamertag = (gamertag) => {
        const path = generatePath(this.props.match.path, {
            gamertag,
        })

        this.props.history.push(path)
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
        // wait until component has mounted
        if (!this.state.paths) {
            return <></>
        }

        return (
            <AppContext.Provider
                value={{
                    ...this.state,
                    setGamertag: this.setGamertag,
                    showMessage: this.showMessage,
                    showError: this.showError,
                    closeSnackbar: this.closeSnackbar,
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
