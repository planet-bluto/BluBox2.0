const BluBox_INFO = {v: "2.1", t: "BluBox"};

(() => {
	var As = Array.from(document.querySelectorAll("a"))
	As.forEach(a => {
		console.log(a.href)
		a.onclick = e => {
			e.preventDefault()
			nw.Shell.openExternal(a.href)
		}
	})

	var input = document.getElementById("openbox-url")
	var button = document.getElementById("openbox-button")
	var samples = document.getElementById("openbox-samples")

	samples.onclick = e => { console.log(`BRO`); nw.Shell.showItemInFolder(nw.__dirname+`\samples`) }

	button.onclick = e => {
		var bits = input.value.split("/")
		var data = bits[3].split("#")[1]

		window.location.href = "#" + data
	}
})();