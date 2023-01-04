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

		// let cmd = `qpdf --json "${file}" | jq '.objects' | grep -Po 'Title": \\K.*'`
		let cmd = `pdftk "${file}" dump_data_utf8 | grep '^Bookmark'`
		let result = await ShellExec(cmd)
		let titles = []
		result.split('BookmarkBegin').forEach((part, i) => {
			if (i === 0) {
				return false
			}
			part = part.trim()

			let lines = part.split('\n')

			let title = lines[0]
			title = title.slice(title.indexOf(':')).trim()

			let level = lines[1]
			level = level.slice(level.indexOf(':')).trim()
			level = Number(level)

			let page = lines[2]
			page = page.slice(page.indexOf(':')).trim()
			page = Number(page)

			let titlePrefix = ""
			for (let i = 1; i < level.length; i++) {
				titlePrefix = titlePrefix + '-'
			}

			titles.push(`${titlePrefix} ${title} (${page})`)
		})
		titles = titles.join('\n').trim()
		
		fs.writeFileSync(path.join(dirname, filenameNoExt + '.txt'), titles, 'utf8')
  }
}

main()
