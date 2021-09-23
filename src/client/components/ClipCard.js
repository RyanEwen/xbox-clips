import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

const useStyles = makeStyles({
    videoPlayer: {
        width: '100%',
    },
    // card: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     height: '100%',
    // },
    // cardContent: {
    //     flexGrow: 1,
    // },
    // cardActions: {
    //     display: 'flex',
    //     justifyContent: 'space-between',
    // },
})

export default function ClipCard(props) {
    const { clip } = props
    const classes = useStyles()

    return (
        <video className={classes.videoPlayer} poster={clip.thumbnails[0].uri} preload="auto" controls>
            <source src={clip.gameClipUris[0].uri} type="video/mp4" />
        </video>
        // <Card className={classes.card}>
        //     <CardContent className={classes.cardContent}>
        //         <Typography gutterBottom variant="h5">
        //             {clip.name}
        //         </Typography>
        //         <Typography variant="body2" color="textSecondary">
        //             {clip.nicknames.join(', ')}
        //         </Typography>
        //         <p />
        //         <Typography>{clip.ipAddress}</Typography>
        //         <Typography>{clip.hostname}</Typography>
        //     </CardContent>
        //     <CardActions className={classes.cardActions}>

        //     </CardActions>
        // </Card>
    )
}
