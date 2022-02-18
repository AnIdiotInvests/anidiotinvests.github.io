/** 
 * cookie-consent.js
 * An Idiot Invests (anidiotinvets.com)
 * JavaScript functions to check for cookie consent banner for site usage.
 * This 
 */

const consentValue = "anidiotinvests-cookie-consent";

function checkConsent() {
    try {
        document.getElementById("consent-banner-display").className = "hide-consent-banner";
        if (!hasLocalStorageConsent()) {
            askForConsent();
        }
    } catch (error) {
        console.error(error);
    }
}

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

/**
 * Invoke consent banner check on page load at window onload scope.
 */
window.onload = checkConsent();