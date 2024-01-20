let express = require('express')
let path = require('path')

let {open} = require('sqlite')
let sqlite3 = require('sqlite3')
let app = express()

let dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

app.use(express.json())

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
  } catch (e) {
    console.log(`${e.message}`)
    process.exit(1)
  }
}
initializeDBandServer()

app.get('/players/', async (request, response) => {
  const playersAll = `
  SELECT 
  * 
  FROM 
  cricket_team 
  ORDER BY 
  player_id;`
  const playersArray = await db.all(playersAll)
  response.send(playersArray)
})

app.post('/players/', async (request, response) => {
  const playersDetails = request.body
  const {playerName, jerseyNumber, role} = playersDetails
  const playerAdd = `INSERT INTO cricket_team (player_name, jersey_number, role) VALUES(
    ${playerName}, 
    ${jerseyNumber},
    ${role},
  );`
  const res = await db.run(playerAdd)
  const playerId = res.lastID
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerGet = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`
  const playerone = await db.get(playerGet)
  response.send(playerone)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playersDetails = request.body
  const {playerName, jerseyNumber, role} = playersDetails
  const playerUpdt = `UPDATE cricket_team SET
   player_name = ${playerName},
   jersey_number = ${jerseyNumber},
   All-Rounder = ${role}
   WHERE playerId = ${playerId};`
  await db.run(playerUpdt)
  response.send('Player details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDel = `DELETE FROM cricket_team WHERE playerId = ${playerId};`
  await db.run(playerDel)
  response.send('Player Removed')
})

module.exports = app
