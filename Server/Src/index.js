import express from 'express'
const app = express()
const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.send('Hello, Server this side')
})

app.listen(PORT, () => {
    console.log(`App is listening on PORT:${PORT}`);

})