import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { expressApiLog as log } from '../connections/loggers'
import timeout from 'connect-timeout'
import { reqTimeoutSecs, maxFileSizeBytes } from './config'
import './email/jobs'
import { corsAllowedList, isAllCorsAllowed, port } from '../env'
import https from 'https'
import { loadSSL } from '../utils'

require('dotenv').config()

const app = express()

const corsOpts = function (req: express.Request, callback) {
  const corsOptions = { origin: false }

  if (
    isAllCorsAllowed ||
    req.method === 'GET' ||
    corsAllowedList.indexOf(req.header('Origin')) !== -1
  ) {
    corsOptions.origin = true // reflect (enable) the requested origin in the CORS response
  }

  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOpts))

function haltOnTimedout(req: express.Request, _res: express.Response, next) {
  if (!req.timedout) next()
}

app.use(timeout(`${reqTimeoutSecs}s`))

// for parsing application/json
app.use(bodyParser.json({ limit: maxFileSizeBytes }))
app.use(haltOnTimedout)

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: maxFileSizeBytes }))
app.use(haltOnTimedout)

// add static folder
app.use(express.static('./email/templates'))

export const startHttpServer = async () => {
  const ssl = await loadSSL()

  https
  .createServer(ssl, app)
  .listen(port, async () => {
app.get(getV1Offchain('/polls/:pollId/:account/vote'), pollsHandlers.getVoteByAccountAndPollHandler)
app.get(getV1Offchain('/polls/:pollId/votes'), pollsHandlers.getVoteByPollHandler)
app.get(getV1Offchain('/polls/snapshot/:account'), pollsHandlers.accountFromSnapshotHandler)
app.post(getV1Offchain('/polls/upsert'), checkRegularSignature, pollsHandlers.upsertVoteHandler)
    log.info(`HTTP server started on port ${port}`)
  })
}
  
