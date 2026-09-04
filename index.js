const PROMO_LOCATION = "Assets/Promo/"
var sfwMode = true;

var nsfwDivs = new Array();
var sfwDivs = new Array();

// True init
document.addEventListener('DOMContentLoaded', function() {
	// Show verification buttons
	document.getElementsByClassName("javascript-disabled")[0].style.display = "block";
	// My friend's silly buttons x3
	initPromo();
	// If you are an adult, allow access.
	if(document.cookie != null && get_cookie_variable(document.cookie,"IAgreeIm18") == "true") {
		youAreAnAdult();
	}

});

// Verification

function youAreAnAdult() {
	showWebsite();
	if(document.cookie != null && get_cookie_variable(document.cookie,"SFWMode") == "false"){
		sfwMode = false;
	}
	const d = new Date();
	d.setTime(d.getTime() + (31*24*60*60*1000));
	document.cookie = "IAgreeIm18=true;expires="+d.toUTCString()+"Path='/';SameSite=None;Secure;";
	document.cookie = "SFWMode="+sfwMode+";expires="+d.toUTCString()+"Path='/';SameSite=None;Secure;";
	backgroundResize();
}

function notAnAdult() {
	// get outta here
	history.back();
}

function nsfwToggle() {
	sfwMode = !sfwMode;
	const d = new Date();
	d.setTime(d.getTime() + (31*24*60*60*1000));
	document.cookie = "SFWMode="+sfwMode+";expires="+d.toUTCString()+"Path='/';SameSite=None;Secure;";
	nsfwDisplay();
}

function nsfwDisplay() {
	for(let i = 0; i < nsfwDivs.length; i++) {
		if(sfwMode)nsfwDivs[i].classList.add("hidden");
		else nsfwDivs[i].classList.remove("hidden");
	}
	for(let i = 0; i < sfwDivs.length; i++) {
		if(sfwMode)sfwDivs[i].classList.remove("hidden");
		else sfwDivs[i].classList.add("hidden");
	}
	if(sfwMode)document.getElementById("NSFWSwitch").textContent = "NSFW Mode";
	else document.getElementById("NSFWSwitch").textContent = "SFW Mode";
}

function showWebsite() {
	document.getElementsByClassName("to-be-verified")[0].style.display = "block";
	document.getElementsByClassName("verify-your-adult")[0].style.display = "none";
}

// Promo (friends)

function initPromo() {
	$.getJSON(PROMO_LOCATION + "Promo.json").done(function(data) {
		let page_div = document.getElementById("main-page");
		setupPromoSection(data,page_div)
		nsfwDisplay();
	})
}

function createPromoButton(data,section_div) {
	let button_div = document.createElement('a');
	let button_img = document.createElement('img');

	button_div.setAttribute("href",data.Link);
	button_div.setAttribute("target","_blank");

	button_img.className = "promo-image-links";
	button_img.src = PROMO_LOCATION + data.Button;

	if(data.NSFW) {
		nsfwDivs.push(button_div);
	}
	if(data.SFW) {
		sfwDivs.push(button_div);
	}

	section_div.appendChild(button_div);
	button_div.appendChild(button_img);
}

function setupPromoSection(data,page_div) {
	let u = 0;
	let current_div = document.createElement('div');
	current_div.className = "promo-row";
	page_div.appendChild(current_div);
	for(const i in data) {
		createPromoButton(data[i],current_div);
	}
}

// Silly background

addEventListener("resize", (event) => {
	backgroundResize();
});

function backgroundResize() {
	let windowSizeMul = (window.innerHeight / 480);
	let windowScreenWid = 320 * windowSizeMul;
	let windowScreenFinal = Math.ceil(window.innerWidth / windowScreenWid) * 2 * windowScreenWid;
	//style.setProperty('--background-width',	windowScreenFinal + 'px');
}

/* Thank you so much w3schools.com you are my favorite website :) */

function get_cookie_variable(cookies,cookie_name) {
	let name = cookie_name + "=";
	let decodedCookie = decodeURIComponent(cookies);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
