function checkConsent() {
    document.getElementById("consent-banner-display").className = "hide-consent-banner";
    if (!hasConsent()) {
        askForConsent();
    }
}

var consentValue = "anidiotinvests-cookie-consent";

function hasConsent() {
    return localStorage.getItem(consentValue);
}

function askForConsent() {
    console.log("asking for consent");
    document.getElementById("consent-banner-display").className = "show-consent-banner";
}

function hideConsentBannerOnAccept() {
    console.log("consent obtained");
    createCookie();
    document.getElementById("consent-banner-display").className = "hide-consent-banner";
}

function createCookie() {
    localStorage.setItem(consentValue, true);
}


window.onload = checkConsent();