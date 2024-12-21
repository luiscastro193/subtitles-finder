"use strict";
const form = document.querySelector('form');
const links = document.querySelector('ul');
const storage = JSON.parse(localStorage.getItem("subtitles") || '{}');

function save(series, season, episode) {
	storage[series] = {season, episode};
	localStorage.setItem("subtitles", JSON.stringify(storage));
}

function removeSeries(name) {
	delete storage[name];
	localStorage.setItem("subtitles", JSON.stringify(storage));
}

function addLink(series, season, episode) {
	let seasonString = season.toString().padStart(2, '0');
	let episodeString = episode.toString().padStart(2, '0');
	
	let item = document.createElement('li');
	let link = document.createElement('a');
	link.textContent = `${series} S${seasonString}E${episodeString}`;
	link.href = `https://www.addic7ed.com/search.php?search=${encodeURIComponent(series)}+${seasonString}x${episodeString}`;
	link.target = "_blank";
	link.rel = "noopener";
	
	link.addEventListener('click', () => {
		if (!item.nextElementSibling) {
			addLink(series, season, episode + 1);
			save(series, season, episode + 1);
		}
	});
	
	item.appendChild(link);
	links.appendChild(item);
}

function addSeries(name) {
	let item = document.createElement('li');
	let link = document.createElement('a');
	let remove = document.createElement('a');
	
	link.textContent = name;
	link.href = "javascript:void(0)";
	link.addEventListener('click', () => {
		form.series.value = name;
		if (storage[name]) {
			form.season.valueAsNumber = storage[name].season;
			form.episode.valueAsNumber = storage[name].episode;
		}
		loadForm();
		links.querySelector('a').click();
	});
	
	remove.textContent = "(x)";
	remove.href = "javascript:void(0)";
	remove.tabIndex = -1;
	remove.addEventListener('click', () => {
		if (confirm(`Do you want to remove "${name}"?`)) {
			removeSeries(name);
			loadForm();
		}
	});
	
	item.appendChild(link);
	item.insertAdjacentHTML('beforeend', "&nbsp&nbsp&nbsp");
	item.appendChild(remove);
	links.appendChild(item);
}

function loadForm() {
	links.innerHTML = '';
	
	if (form.series.value)
		addLink(form.series.value, form.season.valueAsNumber || 1, form.episode.valueAsNumber || 1);
	else
		Object.keys(storage).forEach(addSeries);
}

for (let input of document.querySelectorAll('input')) {
	input.addEventListener('mouseenter', () => input.select());
	input.addEventListener('input', loadForm);
}

loadForm();
