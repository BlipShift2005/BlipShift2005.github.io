let openWindows = new Set();
let activeWindow = null;
let zIndexCounter = 1000;
let draggedElement = null;
let offset = { x: 0, y: 0 };
let selectedIcon = null;

function initDragAndDrop() {
	document.addEventListener('mousedown', function(e) {
		const header = e.target.closest('.blipwindow-header');
		if (header && !e.target.closest('.blipwindow-controls')) {
			draggedElement = header.parentElement;
			const rect = draggedElement.getBoundingClientRect();
			offset.x = e.clientX - rect.left;
			offset.y = e.clientY - rect.top;

			const windowId = draggedElement.id.replace('-window', '');

			setActiveWindow(windowId);

			e.preventDefault();
			if(e.target.closest('.immobile')) {
				draggedElement = null;
			}
		}

	});

	document.addEventListener('mousemove', function(e) {
		if (draggedElement) {
			const x = e.clientX - offset.x;
			const y = e.clientY - offset.y;

			const maxX = window.innerWidth - draggedElement.offsetWidth;
			const maxY = window.innerHeight - draggedElement.offsetHeight - 28;

			draggedElement.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
			draggedElement.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
		}
	});

	document.addEventListener('mouseup', function() {
		draggedElement = null;
	});
}

function openWindow(windowId) {
	const windowEl = document.getElementById(windowId + '-window');
	if (!windowEl) return;

	windowEl.classList.add('visible');
	windowEl.classList.remove('inactive');
	openWindows.add(windowId);
	setActiveWindow(windowId);
	//addToTaskbar(windowId);
	//closeStartMenu();

	//clearIconSelection();
}

function closeWindow(windowId) {
	const windowEl = document.getElementById(windowId + '-window');
	if (!windowEl) return;

	windowEl.classList.remove('visible', 'active');
	windowEl.classList.add('inactive');
	openWindows.delete(windowId);
	//removeFromTaskbar(windowId);

	if (openWindows.size > 0) {
		const nextWindow = Array.from(openWindows)[0];
		setActiveWindow(nextWindow);
	} else {
		activeWindow = null;
	}
}

function minimizeWindow(windowId) {
	const windowEl = document.getElementById(windowId + '-window');
	if (!windowEl) return;

	windowEl.classList.remove('visible');
	windowEl.classList.remove('active');
	windowEl.classList.add('inactive');

	const taskbarItem = document.querySelector(`[data-window="${windowId}"]`);
	if (taskbarItem) {
		taskbarItem.classList.remove('active');
	}
}

function maximizeWindow(windowId) {
	const windowEl = document.getElementById(windowId + '-window');
	if (!windowEl) return;

	if (windowEl.style.width === '100vw' || windowEl.classList.contains('maximized')) {
		windowEl.classList.remove('maximized');
		windowEl.style.width = windowEl.dataset.originalWidth || '450px';
		windowEl.style.height = windowEl.dataset.originalHeight || '350px';
		windowEl.style.top = windowEl.dataset.originalTop || '100px';
		windowEl.style.left = windowEl.dataset.originalLeft || '200px';
	} else {
		windowEl.dataset.originalWidth = windowEl.style.width;
		windowEl.dataset.originalHeight = windowEl.style.height;
		windowEl.dataset.originalTop = windowEl.style.top;
		windowEl.dataset.originalLeft = windowEl.style.left;

		windowEl.classList.add('maximized');
		windowEl.style.width = '100vw';
		windowEl.style.height = 'calc(100vh - 28px)';
		windowEl.style.top = '0';
		windowEl.style.left = '0';
	}
}

function setActiveWindow(windowId) {
	document.querySelectorAll('.blipwindow').forEach(w => {
		w.classList.remove('active');
		w.classList.add('inactive');
	});

	document.querySelectorAll('.taskbar-item').forEach(t => {
		t.classList.remove('active');
	});

	const windowEl = document.getElementById(windowId + '-window');
	if (windowEl) {
		windowEl.classList.add('active');
		windowEl.classList.remove('inactive');
		windowEl.style.zIndex = ++zIndexCounter;

		if(windowEl.classList.contains('immobile')) {
			windowEl.style.zIndex = 0;
		}

		activeWindow = windowId;
	}

	// const taskbarItem = document.querySelector(`[data-window="${windowId}"]`);
	// if (taskbarItem) {
	// 	taskbarItem.classList.add('active');
	// }
}

document.addEventListener('click', function(e) {
	//     const startMenu = document.getElementById('start-menu');
	//     const startButton = document.querySelector('.start-button');
	//
	//     if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
	//         closeStartMenu();
	//     }

	const window = e.target.closest('.blipwindow');
	if (window) {
		const windowId = window.id.replace('-window', '');
		setActiveWindow(windowId);
	}

	// const icon = e.target.closest('.icon');
	// if (icon) {
	// 	clearIconSelection();
	// 	icon.classList.add('selected');
	// 	selectedIcon = icon;
	// } else if (!window) {
	// 	clearIconSelection();
	// }
});

document.addEventListener('dblclick', function(e) {
	const icon = e.target.closest('.icon');
	if (icon) {
		icon.click();
	}
});

document.addEventListener('dragstart', function(e) {
	e.preventDefault();
});

document.addEventListener('keydown', function(e) {
	if (e.altKey && e.key === 'Tab') {
		e.preventDefault();
	}

	if (e.key === 'Escape') {
		//closeStartMenu();
	}
});

document.addEventListener('DOMContentLoaded', function() {
	initDragAndDrop();
	//updateClock();
	//setInterval(updateClock, 1000);

	// setTimeout(() => {
	//     openWindow('about');
	// }, 500);
});
