import fs from 'fs'

export default (json, filename) => {
  if (process.env.WRITEJSON !== 'true') return

  const exists = fs.existsSync('./debug')
  if (!exists) {
    fs.mkdirSync('./debug')
  }
  fs.writeFileSync(`./debug/${filename}.json`, JSON.stringify(json, null, 2))
}
