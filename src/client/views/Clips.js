import _ from 'lodash'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import React, { useContext } from "react"
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Link as RouterLink, Route, Switch, useParams, useRouteMatch, withRouter } from "react-router-dom"
import { withAppContext } from '../context/AppContextProvider'
import Heading from '../components/Heading'
import ClipListItem from '../components/ClipListItem'
import ClipCard from '../components/ClipCard'
import { AppContext } from "../context/AppContextProvider"
import API from '../classes/API'

const styles = (theme) => ({
    loading: {
        marginTop: theme.spacing(2),
    },
    breadcrumbs: {
        marginTop: theme.spacing(2),
    },
})

class Clips extends React.Component {
    state = {
        waits: 1,
        clips: [],
    }

    componentDidMount = async () => {
        const { gamertag } = this.props

        await this.fetchClips(gamertag)

        this.setState({
            waits: this.state.waits - 1,
        })
    }

    fetchClips = async (gamertag) => {
        if (!gamertag) {
            return
        }

        try {
            this.setState({
                waits: this.state.waits + 1,
            })

            const { gameClips } = await API.Base.post(`/api/clips/${gamertag}`)

            this.setState({
                waits: this.state.waits - 1,
                clips: gameClips,
            })

        } catch (err) {
            this.props.showError(err)
        }
    }

    render() {
        const { classes, history, match, gamertag } = this.props
        const { waits, clips } = this.state
        const { url, path } = match

        return (
            <Container maxWidth="sm">
                {waits > 0 && <>
                    <Heading>{`${gamertag}'s Clips`}</Heading>
                    <LinearProgress className={classes.loading} />
                </>}
                {waits == 0 &&
                    <Switch>
                        <Route path={`${path}/`} exact>
                            <Heading>{`${gamertag}'s Clips`}</Heading>
                            <List>
                                {clips.map(clip =>
                                    <ClipListItem
                                        key={clip.gameClipId}
                                        clip={clip}
                                        onClick={(clip) => {
                                            history.push(`${url}/${clip.gameClipId}`)
                                        }}
                                    />
                                )}
                            </List>
                        </Route>
                        <Route path={`${path}/:clipId`}>
                            <MyClipCard clips={clips} />
                        </Route>
                    </Switch>
                }
            </Container>
        )
    }
}

const useStyles = makeStyles((theme) => ({
    clipBox: {
        marginTop: theme.spacing(2),
    },
}))

function MyClipCard(props) {
    const classes = useStyles(props)
    const { gamertag } = useContext(AppContext)
    const { clips } = props
    const { clipId } = useParams()
    const clip = clips.find(clip => clip.gameClipId == clipId)

    return <>
        <Heading>{`${gamertag} - ${clip.titleName}`}</Heading>
        <Box className={classes.clipBox}>
            <ClipCard
                clip={clip}
            />
        </Box>
    </>
}

export default withAppContext(withRouter(withStyles(styles, { withTheme: true })(Clips)))
