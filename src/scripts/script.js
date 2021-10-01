"use strict";

const gameBoard = document.querySelector(".game");

let imageArray = [];
let pickableImages = [];

const toggle = (tile) => {
	tile.classList.toggle("active");
};

// Game Grid ------------------------------------
const populateGrid = () => {
	gameBoard.innerHTML = "";

	// Generate image array.
	imageArray = [];
	for (let i = 1; i < 25; i++) {
		imageArray.push(`./src/images/ (${i}).jpg`);
	}

	// Remove random excess images.
	while (imageArray.length > 16) {
		imageArray.splice(Math.floor(Math.random() * imageArray.length), 1);
	}

	// Shuffle the array.
	for (let i = imageArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[imageArray[i], imageArray[j]] = [imageArray[j], imageArray[i]];
	}

	// Populate the pickableImages array.
	pickableImages = [...imageArray];

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
		gameBoard.style.width = `${window.innerHeight * sizeDif}px`;
		gameBoard.style.height = `${window.innerHeight * sizeDif}px`;

		for (let child of gameBoard.childNodes) {
			child.style.borderWidth = `${Math.round(
				(window.innerHeight * sizeDif) / 100
			)}px`;
		}

		try {
			document.querySelector(".displayImg").style.width = `${
				window.innerHeight * sizeDif
			}px`;
			document.querySelector(".displayImg").style.height = `${
				window.innerHeight * sizeDif
			}px`;
		} catch {}
	} else {
		gameBoard.style.width = `${window.innerWidth * sizeDif}px`;
		gameBoard.style.height = `${window.innerWidth * sizeDif}px`;

		for (let child of gameBoard.childNodes) {
			child.style.borderWidth = `${Math.round(
				(window.innerWidth * sizeDif) / 100
			)}px`;
		}

		try {
			document.querySelector(".displayImg").style.width = `${
				window.innerWidth * sizeDif
			}px`;
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
	if (!canSpin || pickableImages.length === 0) return;

	canSpin = false;

	wheel.classList.add("spinning");
};

wheel.addEventListener("animationend", () => {
	wheel.classList.remove("spinning");

	showImage();
});

const showImage = () => {
	let imageSource = Math.floor(Math.random() * pickableImages.length);

	// Show and change the source of the image.
	dispImg.src = pickableImages[imageSource];
	dispImg.classList.add("visible");

	console.log(pickableImages[imageSource]);

	document
		.querySelector(
			`.tile-${imageArray.indexOf(pickableImages[imageSource])}`
		)
		.classList.add("selected");

	pickableImages.splice(imageSource, 1);

	// Resize the image.
	resizeBoard();
};

const closeImage = () => {
	// Hide the image.
	dispImg.classList.remove("visible");

	// Allow spinning again.
	if (pickableImages.length !== 0) {
		canSpin = true;
	} else {
		wheel.classList.add("hidden");
	}
};
