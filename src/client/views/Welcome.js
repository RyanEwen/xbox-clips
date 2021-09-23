import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import React from 'react'
import Heading from '../components/Heading'

const useStyles = makeStyles((theme) => ({
    box: {
        marginTop: theme.spacing(3),
    },
}))

export default function Welcome(props) {
    const classes = useStyles()

    return (
        <Container maxWidth="xs">
            <Heading icon={<AssignmentTurnedInIcon />}>
                Welcome
            </Heading>
            <Box spacing={2} className={classes.box}>
                <Typography paragraph>Enter a gamertag at the top of the page to get started.</Typography>
            </Box>
        </Container>
    )
}
