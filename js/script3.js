let counter = 0;
let currentDrag;

document.addEventListener('click', e => {
	if (e.target.classList.contains('new-item')) {
		const newItem = createItem();
		const zone = getCurrentZone(e.target);

		zone.insertBefore(newItem, zone.lastElementChild)
	}
});

document.addEventListener('dragstart', (e) => {
	const zone = getCurrentZone(e.target);

	if (zone) {
		currentDrag = { startZone: zone, node: e.target };
		e.dataTransfer.setData('text/html', 'dragstart');
	}
});

document.addEventListener('dragover', (e) => {
	const zone = getCurrentZone(e.target);

	if (zone) {
		e.preventDefault();
	}
});

document.addEventListener('drop', (e) => {
	e.preventDefault();
	const zone = getCurrentZone(e.target);

	if (currentDrag) {
		if (zone && currentDrag.startZone !== zone) {
			if (e.target.classList.contains('item')) {
				zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
			} else {
				zone.insertBefore(currentDrag.node, zone.lastElementChild);
			}
		}

		currentDrag = null;
	} else {
		const dt = e.dataTransfer;

		if (dt.files && dt.files.length) {
			const fd = new FormData();

			for (const file of dt.files) {
				fd.append('files', file);

				const reader = new FileReader();

				reader.readAsDataURL(file);
				reader.addEventListener('load', () => {
					const item = createItem(reader.result);
					zone.insertBefore(item, zone.lastElementChild);
				});
			}

			fetch('/foo', { method: 'POST', body: fd });
		}
	}
});

function createItem(background) {
	const newDiv = document.createElement('div');

	counter++;

	if (background) {
		newDiv.style.background = `url(${background})`;
		newDiv.style.backgroundSize = `cover`;
	} else {
		newDiv.textContent = counter;
	}
	newDiv.classList.add('item');
	newDiv.draggable = true;

	return newDiv;
}

function getCurrentZone(from) {
	// return from.parentNode;
	// return from.closest('.drop-zone');

	do {
		if (from.classList.contains('drop-zone')) {
			return from;
		}
	} while (from = from.parentElement);

	return null;
}