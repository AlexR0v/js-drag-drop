const source = document.querySelector('.source');
const target = document.querySelector('.target');
let counter = 0;

makeDnD([source, target]);

document.addEventListener('click', e => {
	if (e.target.classList.contains('new-item')) {
		const newItem = createItem();
		const zone = e.target.parentNode;

		// zone.lastElementChild - кнопка с плюсом
		zone.insertBefore(newItem, zone.lastElementChild);
	}
});

function createItem() {
	const newDiv = document.createElement('div');

	newDiv.textContent = counter++;
	newDiv.classList.add('item');
	newDiv.draggable = true;

	return newDiv;
}

function makeDnD(zones) {
	let currentDrag;

	for (const zone of zones) {
		zone.addEventListener('dragstart', (e) => {
			e.dataTransfer.setData('text/html', '...');
			currentDrag = { source: zone, node: e.target };
		});

		zone.addEventListener('dragover', (e) => {
			e.preventDefault();
		});

		zone.addEventListener('drop', (e) => {
			if (currentDrag) {
				e.preventDefault();

				if (currentDrag.source !== zone) {
					if (e.target.classList.contains('item')) {
						zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
					} else {
						zone.insertBefore(currentDrag.node, zone.lastElementChild);
					}
				}

				currentDrag = null;
			}
		});
	}
}