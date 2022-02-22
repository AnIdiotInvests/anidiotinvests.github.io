/** 
 * cookie-consent.js
 * An Idiot Invests (anidiotinvets.com)
 * JavaScript functions to check for cookie consent banner for site usage.
 */

const consentValue = "anidiotinvests-cookie-consent-02-18-2022";

setTimeout(function checkConsent() {
    try {
        if (!hasLocalStorageConsent()) {
            askForConsent();
        }
    } catch (error) {
        console.error(error);
    }
}, 5000 );

function hasLocalStorageConsent() {
    return localStorage.getItem(consentValue);
}

function askForConsent() {
    console.log("asking for consent");
    document.getElementById("consent-banner-display").className = "show-consent-banner";
}

/** 
 * Calling the method from button in consent banner to initiate cookie creation and hide banner.
 */
function hideConsentBannerOnAccept() {
    console.log("consent obtained");
    localStorage.setItem(consentValue, true);
    document.getElementById("consent-banner-display").className = "hide-consent-banner";
}

function tempHideConsent() {
    document.getElementById("consent-banner-display").className = "hide-consent-banner";
}

/**
 * Invoke consent banner check on page load at window onload scope.
 */
window.onload = tempHideConsent();