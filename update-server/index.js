const fs = require('fs')
const express = require('express')
const path = require('path')

const app = express()

app.get('/updates/:platform/latest', function (req, res) {
    const latest = getLatestRelease()
    const clientVersion = req.query.v
    if (clientVersion === latest) {
        res.status(204).end()
    } else {
        let baseURL = getBaseUrl()
        let updateURL = baseURL + `/releases/${patform}/${latest}/electron.zip`;

        res.json({
            url: updateURL,
            name: "My Release Name",
            notes: "These are some release notes",
            pub_date: (new Date()).toISOString()
        })
    }
})

let getLatestRelease = (platform) => {
    const dir = __dirname + `/releases/${platform}`;
    const versionsDesc = fs.readdirSync(dir).filter((file) => {
        const filePath = path.join(dir, file)
        return fs.statSync(filePath).isDirectory()
    }).reverse()
    return versionsDesc[0];
}

let getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  } else {
    return 'http://your-company.com'
  }
}

app.listen(process.env.PORT || 3000, () => {
  console.log(`Express server listening on port ${process.env.PORT || 3000}`)
});