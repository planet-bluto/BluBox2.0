const print = console.log
const rcedit = require('rcedit')
var fs = require('fs-extra')
var ProgressBar = require('progress')
var {zip} = require('zip-a-folder')

var package = require('./package.json')

const root_dirs = [
	{type: "file", name: "index.html"},
	{type: "file", name: "package.json"},
	{type: "file", name: "beepbox_editor.min.js"},
	{type: "file", name: "loader.js"},
	{type: "folder", name: "node_modules"},
]

const EDITIONS = {
	"win": ["32", "64"],
	"lin": ["32", "64"],
	"osx": ["64"]
}

print("Initializing...")

var bar = new ProgressBar('[ :current / :total ] :bar :elapsed', { total: (5*root_dirs.length)+5+2+5 })
Object.keys(EDITIONS).forEach(key => {
	let archs = EDITIONS[key]
	archs.forEach(async arch => {
		let bin_dir = `./bin/${key}${arch}`
		let dest_dir = `./dist/blubox-${key}${arch}-v${package.version}`

		bar.tick()

		fs.ensureDirSync(dest_dir)
		fs.emptyDirSync(dest_dir)
		await fs.copy(bin_dir, dest_dir)

		let root_dest = dest_dir
		if (key == "osx") {
			root_dest = root_dest+"/nwjs.app/Contents/Resources/app.nw"
		}

		root_dirs.forEach(async (root, i) => {
			if (root.type == "file") {
				await fs.copy(("./front/"+root.name), (root_dest+`/${root.name}`))
			} else {
				await fs.copy(("./front/"+root.name), (root_dest+`/${root.name}`))
			}
			bar.tick()
		}) 

		if (key == "win") {
			await rcedit(`${dest_dir}/nw.exe`, {
				"file-version": package.version,
				"product-version": package.version,
				"icon": "./front/assets/icon.ico"
			})
			await fs.rename(`${dest_dir}/nw.exe`, `${dest_dir}/blubox-v${package.version}.exe`)
			bar.tick()
		}

		await zip(dest_dir, `./dist/blubox-${key}${arch}-v${package.version}.zip`)
		bar.tick()
	})
})
