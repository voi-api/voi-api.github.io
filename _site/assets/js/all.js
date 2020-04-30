let button = document.getElementById('nav-button'),
	menu = document.getElementById('toc-wrapper'),
	menuLinks = menu.getElementsByTagName("a"),
	subMenus = menu.getElementsByTagName("ul"),
	offset,
	getIds = () => {
		let id = offset.find(o => o.offset > window.scrollY).id;
		
		[...menuLinks].forEach(link => link.classList.toggle("active",  link.hash === "#"+id));
		//Make submenus active if they contain an active link.
		[...subMenus].forEach(menu => {
			let items = menu.getElementsByTagName("li");
			isActive = [...items].some((item) => item.getElementsByTagName("a")[0].hash === "#"+id)
			menu.classList.toggle("active-parent", isActive)
		})

	},
	throttle = (fn, wait) => {
	  var time = Date.now();
	  return function() {
	    if ((time + wait - Date.now()) < 0) {
	      fn();
	      time = Date.now();
	    }
	  }
	};
button.onclick = function () {
	button.classList.toggle('open');
	menu.classList.toggle('open');
};

window.addEventListener('scroll', throttle(getIds, 100));
window.addEventListener('load', getIds);

window.addEventListener('load', () => {
	let headers = document.getElementById('content').querySelectorAll('h1, h2');
	offset = [...headers].map((h, i) => {
		let next = headers[i + 1];
		//Last item corner case
		if(typeof next === "undefined") {
			next = {offsetTop: Infinity}
		}
		return {id: h.id, offset: next.offsetTop -50}
	})
})
