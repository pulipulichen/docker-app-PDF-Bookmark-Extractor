const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

let main = async function () {
  let files = GetExistedArgv()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    if (file.endsWith('.pdf') === false) {
      continue
    }

    let filename = path.basename(file)
		let dirname = path.dirname(file)
    let filenameNoExt = filename
    if (filenameNoExt.endsWith('.pdf')) {
      filenameNoExt = filenameNoExt.slice(0, -4)
    }

		let result = await ShellExec(`qpdf --json "${file}" | jq '.objects' | grep -Po 'Title": \\K.*'`)
		result = result.split('\n').map(line => {
			line = line.trim()
			if (line.startsWith('"') && line.endsWith('"')) {
				line = line.slice(1, -1)
			}

			while (line.indexOf('  ') > -1) {
				line = line.replace(/  /g, ' ')
			}

			return line.trim()
		})
		result = result.filter(i => i !== '')
		result = result.filter((v, i, a) => a.indexOf(v) === i)
		result = result.join('\n').trim()
		
		fs.writeFileSync(path.join(dirname, filenameNoExt + '.txt'), result, 'utf8')
  }
}

main()
