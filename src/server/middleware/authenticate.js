import dotenv from 'dotenv'
import * as XboxLiveAuth from '@xboxreplay/xboxlive-auth'

dotenv.config()

var authorization

export async function XBLAuthenticateMethod () {
    if (authorization) {
        const hasExpired = authorization.expiresOn !== null && new Date(authorization.expiresOn) <= new Date()

        if (hasExpired === false) {
            return {
                userHash: authorization.user_hash,
                XSTSToken: authorization.xsts_token,
            }
        }
    }

    authorization = await XboxLiveAuth.authenticate(process.env.XLA_USER, process.env.XLA_PASS)

    return {
        userHash: authorization.user_hash,
        XSTSToken: authorization.xsts_token,
    }
}

export default () => (req, res, next) => {
    return XBLAuthenticateMethod()
        .then(response => {
            req.authorization = response
            return next()
        })
        .catch(err => {
            console.error(err)
            return res.sendStatus(401)
        })
}
