console.log(`Starting in ${process.env.NODE_ENV} mode`)

import _ from 'lodash'
import path from 'path'
import express from 'express'
import middleware from './middleware'
import { XSAPI } from '@xboxreplay/xboxlive-api'

try {
    // SETUP WEB SERVER

    const app = express()

    app.set('trust proxy', true)

    // search for actual files before serving app in their place
    app.use(express.static(path.join(__dirname, '..', 'client')))
    app.use(express.static(path.join(__dirname, '..', '..', 'static')))

    // clips
    app.post('/api/clips/:gamertag', middleware.XBLAuthenticateMiddleware(), async (req, res) => {
        try {
            const XSAPIInstance = new XSAPI(req.authorization)

            const player = await XSAPIInstance.getPlayerSettings(req.params.gamertag, [
                'UniqueModernGamertag',
                'GameDisplayPicRaw',
                'Gamerscore',
                'Location',
            ])

            const clips = await XSAPIInstance.getPlayerGameClips(req.params.gamertag, {
                continuationToken: req.params['continuation-token'],
            })

            res.send({ player, clips })

        } catch(err) {
            res.status(500).send(err.message)
        }
    })

    // catch-all to serve the html file
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'index.html'))
    })

    const http = app.listen(process.env.PORT || 3000, process.env.INTERFACE || '0.0.0.0')

    console.log('Express started')

} catch (err) {
    console.error(err)
    process.exit(1)
}
