import React from 'react'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: 'seconds',
        ss: '%d seconds',
        m: "a minutes",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "1 day",
        dd: "%d days",
        M: "1 month",
        MM: "%d months",
        y: "1 year",
        yy: "%d years",
    },
})

const useStyles = makeStyles((theme) => ({

}))

export default function ClipListItem(props) {
    const { clip, onClick } = props
    const classes = useStyles(props)
    const relativeDate = moment(clip.dateRecorded).fromNow()

    function handleClick() {
        onClick(clip)
    }

    return (
        <ListItem
            key={clip.gameClipId} // todo remove?
            button
            onClick={handleClick}
        >
            <ListItemAvatar>
                <Avatar variant="square" alt={clip.titleName} src={clip.thumbnails[0].uri}></Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={clip.titleName}
                secondary={`Captured ${relativeDate}; ${clip.durationInSeconds} seconds long`}
            />
        </ListItem>
    )
}
