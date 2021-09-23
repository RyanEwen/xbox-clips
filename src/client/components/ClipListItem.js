import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({

}))

export default function ClipListItem(props) {
    const { clip, onClick } = props
    const classes = useStyles(props)

    function handleClick() {
        onClick(clip)
    }

    return (
        <ListItem
            key={clip.id}
            button
            onClick={handleClick}
        >
            <ListItemText
                primary={clip.name}
                secondary={clip.length}
            />
        </ListItem>
    )
}
