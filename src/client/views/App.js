import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import blue from '@material-ui/core/colors/blue'
import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Snackbar from '@material-ui/core/Snackbar'
import { alpha, withStyles } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import React from "react"
import { Link as RouterLink, Route, Switch, Redirect, withRouter } from "react-router-dom"
import Copyright from '../components/Copyright'
import NavListItem from '../components/NavListItem'
import InputBase from '@material-ui/core/InputBase'
import { withAppContext } from '../context/AppContextProvider'
import NotFound from './404'
import Clips from './Clips'
import Screenshots from './Screenshots'
import Welcome from './Welcome'

const styles = (theme) => ({
    appBar: {
        backgroundColor: blue[700],
    },
    toolbar: theme.mixins.toolbar,
    title: {
        flexGrow: 1,
        textDecoration: 'none',
        color: 'inherit',
        '&:visited': {
            color: 'inherit',
        },
        '&:active': {
            color: 'inherit',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    drawerList: {
        minWidth: 200,
    },
    outerBox: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        overflow: 'auto',
    },
    innerBox: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
})

class App extends React.Component {
    scrollPaneRef = React.createRef()

    state = {
        drawerOpen: false,
        waits: 0,
    }

    componentDidUpdate(prevProps) {
        // scoll back to top on page change
        if (this.props.location !== prevProps.location && this.scrollPaneRef.current) {
            this.scrollPaneRef.current.scrollTop = 0
        }
    }

    openDrawer = () => {
        this.setState({ drawerOpen: true })
    }

    closeDrawer = () => {
        this.setState({ drawerOpen: false })
    }

    handleGamertagChange = (e) => {
        if (e.key == 'Enter') {
            this.props.setGamertag(e.target.value || null)
        }
    }

    render() {
        const { classes, paths, gamertag } = this.props
        const { drawerOpen, waits } = this.state

        return (
            <>
                <CssBaseline />
                <SwipeableDrawer open={drawerOpen} onClose={this.closeDrawer} onOpen={this.openDrawer}>
                    <List className={classes.drawerList} component="nav">
                        {/* <NavListItem onClick={this.closeDrawer} to={paths.root} primary="Home" exact /> */}
                        <NavListItem onClick={this.closeDrawer} to={paths.clips} disabled={!gamertag} primary="Clips" />
                        <NavListItem onClick={this.closeDrawer} to={paths.screenshots} disabled={!gamertag} primary="Screenshots" />
                    </List>
                </SwipeableDrawer>
                <AppBar classes={{ root: classes.appBar }} position='fixed'>
                    <Toolbar>
                        <Tooltip title="Menu">
                            <IconButton
                                color="inherit"
                                edge="start"
                                aria-label="open menu"
                                onClick={this.openDrawer}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography component={RouterLink} to={paths.root} variant="h6" noWrap className={classes.title}>Xbox Clips</Typography>
                        <div className={classes.search}>
                            <InputBase
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                placeholder="Enter a Gamertag..."
                                defaultValue={gamertag}
                                onKeyDown={this.handleGamertagChange}
                            />
                        </div>
                    </Toolbar>
                </AppBar>
                <div className={classes.toolbar} />
                <Box ref={this.scrollPaneRef} className={classes.outerBox}>
                    <Box className={classes.innerBox}>
                        <Switch>
                            <Route path={paths.root} exact>
                                {!gamertag &&
                                    <Welcome />
                                }
                                {gamertag &&
                                    <Redirect to={paths.clips} />
                                }
                            </Route>

                            {gamertag &&
                                <Route path={paths.clips}>
                                    <Clips />
                                </Route>
                            }

                            {gamertag &&
                                <Route path={paths.screenshots}>
                                    <Screenshots />
                                </Route>
                            }

                            <Route path={paths.root}>
                                <NotFound homePath={paths.root} />
                            </Route>
                        </Switch>
                    </Box>

                    <Box mt={1}>
                        <Copyright />
                    </Box>
                </Box>

                <Snackbar open={waits > 0} message="Loading..." />
            </>
        )
    }
}

export default withAppContext(withRouter(withStyles(styles, { withTheme: true })(App)))
