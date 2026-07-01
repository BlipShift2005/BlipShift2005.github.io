const PROMO_LOCATION = "Assets/Promo/"

// My friend's silly buttons x3
initPromo();

// True init
document.addEventListener('DOMContentLoaded', function() {
	// Show verification buttons
	document.getElementsByClassName("javascript-disabled")[0].style.display = "block";
	// If you are an adult, allow access.
	if(document.cookie != null && get_cookie_variable(document.cookie,"IAgreeIm18") == "true") {
		youAreAnAdult();
	}

});

// Verification

function youAreAnAdult() {
	showWebsite();
	document.cookie = "IAgreeIm18=true;Path='/';SameSite=None;Secure;";
	backgroundResize();
}

function notAnAdult() {
	// get outta here
	history.back();
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
	})
}

function createPromoButton(button,link,section_div) {
	let button_div = document.createElement('a');
	let button_img = document.createElement('img');

	button_div.setAttribute("href",link);
	button_div.setAttribute("target","_blank");

	button_img.className = "promo-image-links";
	button_img.src = PROMO_LOCATION + button;


	section_div.appendChild(button_div);
	button_div.appendChild(button_img);
}

function setupPromoSection(data,page_div) {
	let u = 0;
	let current_div = document.createElement('div');
	current_div.className = "promo-row";
	page_div.appendChild(current_div);
	for(const i in data) {
		createPromoButton(data[i].Button,data[i].Link,current_div);
		u++;
		if(u >= 4) {
			u = 0;
			current_div = document.createElement('div');
			current_div.className = "promo-row";
			page_div.appendChild(current_div);
		}
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
	style.setProperty('--background-width',	windowScreenFinal + 'px');
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
