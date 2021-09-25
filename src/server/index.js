console.log(`Starting in ${process.env.NODE_ENV} mode`)

import _ from 'lodash'
import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import middleware from './middleware'
import dotenv from 'dotenv'

    try {
        dotenv.config()

    // SETUP XBOX LIVE API

        const xla = require('xbox-live-api')

        xla.username = process.env.XLA_USER
        xla.password = process.env.XLA_PASS
        xla.useragent = process.env.XLA_USER_AGENT

        // SETUP WEB SERVER

        const app = express()

        app.set('trust proxy', true)

        // search for actual files before serving app in their place
        app.use(express.static(path.join(__dirname, '..', 'client')))
        app.use(express.static(path.join(__dirname, '..', '..', 'static')))

    // clips
        app.post('/api/clips/:gamertag', (req, res) => {
            try {
            xla.GetClipsForGamer(req.params.gamertag, '', '', function (json) {
                    console.log(json)
                    res.send(json)
                })
            } catch (err) {
            res.status(500).send(err.message)
            }
        })

        app.post('/api/screenshots/:gamertag', (req, res) => {
            try {
                xla.GetScreenshotsForGamer(req.params.gamertag, '', '', function(json) {
                    console.log(json)
                    res.send(json)
                })
            } catch (err) {
                res.status(500).send(err.message)
            }
        })

        app.post('/api/xuid/:gamertag', (req, res) => {
            try {
                xla.GetXuid(req.params.gamertag, function(json) {
                    console.log(json)
                    res.send(json)
                })
            } catch (err) {
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
})()
