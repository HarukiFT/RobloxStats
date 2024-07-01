const { config } = require('dotenv')
const express = require('express')
const path = require('path')

config()

const app = express()

if (!process.env.IS_DEV) {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
    });
}

app.listen(process.env.PORT || 3013, () => {
    console.log('Server started')
})