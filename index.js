const ShellSpawn = require('./app/lib/ShellSpawn')
const GetExistedArgv = require('./app/lib/GetExistedArgv')
const SetDockerComposeYML = require('./app/lib/SetDockerComposeYML')

const path = require('path')
const fs = require('fs')

let main = async function () {
  // 1. 先取得輸入檔案的列表
  let files = GetExistedArgv()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]

    if (file.endsWith('.pdf') === false) {
      continue
    }
    
		let filename = path.basename(file)
		let tempFilename = Math.floor(Math.random() * 100000) + '.pdf'
		let tempFilePath = `/input/` + tempFilename
		fs.renameSync(file, tempFilePath)


    SetDockerComposeYML(tempFilePath)
    await ShellSpawn('docker-compose up')
		fs.renameSync(tempFilePath, file)
		fs.renameSync(`/input/` + tempFilename.slice(0, -4) + '.txt', `/input/` + filename.slice(0, -4) + '.txt')
  }
}

main()
