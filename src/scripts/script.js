"use strict";

const gameBoard = document.querySelector(".game");

let imageArray = [];
let pickableImages = [];
let userType = "player";

const setUser = (type) => {
	userType = type;

	setup();

	document.querySelector(".modal").style.display = "none";
};

const setup = () => {
	if (userType === "player") {
		wheel.classList.add("hidden");
	} else {
		wheel.classList.remove("hidden");
		document.querySelector(".fadingText").classList.add("fading");
	}
};

const toggle = (tile) => {
	if (userType === "caller") return;

	tile.classList.toggle("active");
};

// Game Grid ------------------------------------
const populateGrid = () => {
	gameBoard.innerHTML = "";

	// Generate image array.
	imageArray = [];
	pickableImages = [];
	for (let i = 1; i < 21; i++) {
		imageArray.push(`./src/images/ (${i}).jpg`);
		pickableImages.push(`./src/images/ (${i}).jpg`);
	}

	// Shuffle the array.
	for (let i = imageArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[imageArray[i], imageArray[j]] = [imageArray[j], imageArray[i]];
	}

	// Remove random excess images.
	while (imageArray.length > 16) {
		imageArray.pop(0);
	}

	// Generate image objects.
	for (let i = 0; i < 16; i++) {
		let imgSrc = imageArray[i];
		gameBoard.innerHTML += `<img class="tile-${i} tile" src="${imgSrc}" onclick="toggle(this)"/>`;
	}
};
populateGrid();

const resizeBoard = () => {
	const sizeDif = 0.9;

	if (window.innerWidth * sizeDif > window.innerHeight * sizeDif) {
		gameBoard.style.width = `${window.innerHeight * sizeDif * 0.9}px`;
		gameBoard.style.height = `${window.innerHeight * sizeDif}px`;

		// for (let child of gameBoard.childNodes) {
		// 	child.style.borderWidth = `${Math.round(
		// 		(window.innerHeight * sizeDif) / 100
		// 	)}px`;
		// }

		try {
			document.querySelector(".displayImg").style.height = `${
				window.innerHeight * sizeDif
			}px`;
		} catch {}
	} else {
		gameBoard.style.width = `${window.innerWidth * sizeDif * 0.9}px`;
		gameBoard.style.height = `${window.innerWidth * sizeDif}px`;

		// for (let child of gameBoard.childNodes) {
		// 	child.style.borderWidth = `${Math.round(
		// 		(window.innerWidth * sizeDif) / 100
		// 	)}px`;
		// }

		try {
			document.querySelector(".displayImg").style.height = `${
				window.innerWidth * sizeDif
			}px`;
		} catch {}
	}
};
resizeBoard();
window.addEventListener("resize", () => resizeBoard());

// Wheel ----------------------------------------
const wheel = document.querySelector(".wheel");
const dispImg = document.querySelector(".displayImg");
let canSpin = true;

const spinWheel = (s) => {
	console.log(`(${new Date().getTime()}) Spinning wheel.`);

	if (!canSpin || pickableImages.length === 0 || userType === "player")
		return;

	canSpin = false;

	wheel.classList.add("spinning");
	document.querySelector(".fadingText").classList.add("gone");

	window.setTimeout(spinEnded, 1000);
};

let pickedIndex = 0;
const spinEnded = () => {
	console.log(`(${new Date().getTime()}) Spin animation ended.`);
	wheel.classList.remove("spinning");

	showImage();

	wheel.style = `transform: translateY(-50%) rotate(${-(
		(pickedIndex / 20) * 360 -
		22.5
	)}deg)`;
	console.log(pickedIndex);
};

const showImage = () => {
	console.log(`(${new Date().getTime()}) Showing image.`);
	let randomIDInPickableImages = Math.floor(
		Math.random() * pickableImages.length
	);
	pickedIndex = randomIDInPickableImages + 1;

	// Show and change the source of the image.
	dispImg.src = pickableImages[randomIDInPickableImages];
	dispImg.classList.add("visible");
	document.querySelector(".closeImageText").classList.add("visible");

	try {
		document
			.querySelector(
				`.tile-${imageArray.indexOf(
					pickableImages[randomIDInPickableImages]
				)}`
			)
			.classList.add("selected");
	} catch {
		console.warn(`The caller doesn't have ${pickedIndex}`);
	}

	document.querySelector(`#number-${pickedIndex}`).style.opacity = 0.5;

	pickableImages.splice(randomIDInPickableImages, 1);

	// Resize the image.
	resizeBoard();
};

const closeImage = () => {
	console.log(`(${new Date().getTime()}) Closed image.`);

	// Hide the image.
	dispImg.classList.remove("visible");
	document.querySelector(".closeImageText").classList.remove("visible");

	// Allow spinning again.
	if (pickableImages.length !== 0) {
		canSpin = true;
	} else {
		wheel.classList.add("hidden");
	}
};
