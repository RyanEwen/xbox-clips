import _ from 'lodash'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import { withStyles } from '@material-ui/core/styles'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Link as RouterLink, Route, Switch, useParams, useRouteMatch, withRouter } from "react-router-dom"
import { withAppContext } from '../context/AppContextProvider'
import Heading from '../components/Heading'
import ClipListItem from '../components/ClipListItem'
import ClipCard from '../components/ClipCard'
import API from '../classes/API'

const styles = (theme) => ({
    breadcrumbs: {
        marginTop: theme.spacing(2),
    },
    clipBox: {
        marginTop: theme.spacing(2),
    },
})

class Clips extends React.Component {
    state = {
        clips: [],
    }

    onComponentWillMount = () => {
        const { gamertag } = this.props

        if (gamertag) {
            this.fetchClips(gamertag)
        }
    }

    componentDidUpdate({ gamertag: oldGamertag }) {
        const { gamertag } = this.props

        if (gamertag && gamertag !== oldGamertag) {
            this.fetchClips(gamertag)
        }
    }

    fetchClips = async (gamertag) => {
        try {
            const clips = await API.Base.post(`/api/clips/${gamertag}`)

            this.setState({
                clips,
            })

        } catch (err) {
            this.props.showError(err)
        }
    }

    fetchClip = async (xuid, clipId) => {
        try {
            // const clips = await API.Base.post(`/api/clips/${gamertag}`)

            // this.setState({
            //     clips,
            // })

        } catch (err) {
            this.props.showError(err)
        }
    }

    render() {
        const { classes, history, match, gamertag } = this.props
        const { clips } = this.state
        const url = match.path

        if (!gamertag) {
            return 'No gamertag entered'
        }

        return (
            <Container maxWidth="sm">
                <Heading icon={<MenuBookIcon />}>
                    Clips
                </Heading>
                <Grid container justifyContent="space-between" alignItems="flex-end">
                    <Grid className={classes.breadcrumbs} item xs={12} sm={7} md={9} lg={9}>
                        <Route path={`${url}/:clipId?`}>
                            <MyBreadcrumbs parentUrl={url} clips={clips} />
                        </Route>
                    </Grid>
                </Grid>
                <Switch>
                    <Route path={`${url}/`} exact>
                        <List>
                            {clips.map(clip =>
                                <ClipListItem
                                    key={clip.id}
                                    clip={clip}
                                    onClick={(clip) => { history.push(`${url}/${clip.id}`) }}
                                />
                            )}
                        </List>
                    </Route>
                    <Route path={`${url}/:clipId`}>
                        <Box className={classes.clipBox}>
                            <MyClipCard clips={clips} />
                        </Box>
                    </Route>
                </Switch>
            </Container>
        )
    }
}

function MyBreadcrumbs(props) {
    const { url } = useRouteMatch()
    const { clipId } = useParams()
    const { parentUrl, clips } = props

    if (!clipId) {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to={parentUrl} color="textPrimary">Clips</Link>
            </Breadcrumbs>
        )
    } else {
        const selectedClip = clips.find(clip => clip.id == clipId)

        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to={parentUrl} color="inherit">Clips</Link>
                <Link component={RouterLink} to={url} color="textPrimary">{selectedClip.name}</Link>
            </Breadcrumbs>
        )
    }
}

function MyClipCard(props) {
    const { clipId } = useParams()
    const { clips } = props
    const clip = clips.find(clip => clip.id == clipId)

    return (
        <ClipCard clip={clip} />
    )
}

export default withAppContext(withRouter(withStyles(styles, { withTheme: true })(Clips)))
