import _ from 'lodash'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import { withStyles } from '@material-ui/core/styles'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import React from 'react'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Link as RouterLink, Route, Switch, useParams, useRouteMatch, withRouter } from "react-router-dom"
import { withAppContext } from '../context/AppContextProvider'
import Heading from '../components/Heading'
import ClipListItem from '../components/ClipListItem'
import ClipCard from '../components/ClipCard'
import API from '../classes/API'

const styles = (theme) => ({
    loading: {
        marginTop: theme.spacing(2),
    },
    breadcrumbs: {
        marginTop: theme.spacing(2),
    },
    clipBox: {
        marginTop: theme.spacing(2),
    },
})

class Clips extends React.Component {
    state = {
        waits: 0,
        clips: [],
    }

    componentDidMount = () => {
        const { gamertag } = this.props

        if (gamertag) {
            this.fetchClips(gamertag)
        }
    }

    componentDidUpdate(prevProps) {
        const { gamertag: oldGamertag } = prevProps
        const { gamertag } = this.props

        if (gamertag && gamertag !== oldGamertag) {
            this.fetchClips(gamertag)
        }
    }

    fetchClips = async (gamertag) => {
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
                <Heading icon={<MenuBookIcon />}>
                    Clips
                </Heading>
                {!gamertag &&
                    'Enter a Gamertag'
                }
                {waits > 0 &&
                    <LinearProgress className={classes.loading} />
                }
                {waits == 0 && gamertag &&
                    <Switch>
                        <Route path={`${path}/`} exact>
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
                            <Box className={classes.clipBox}>
                                <MyClipCard clips={clips} />
                            </Box>
                        </Route>
                    </Switch>
                }
            </Container>
        )
    }
}

function MyClipCard(props) {
    const { clipId } = useParams()
    const { clips } = props
    const clip = clips.find(clip => clip.gameClipId == clipId)

    return (
        <ClipCard
            clip={clip}
        />
    )
}

export default withAppContext(withRouter(withStyles(styles, { withTheme: true })(Clips)))
