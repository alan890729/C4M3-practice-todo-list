import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('on route: /')
})

app.listen(port, () => { 
    console.log(`express server running on http://localhost:${port}`)
})