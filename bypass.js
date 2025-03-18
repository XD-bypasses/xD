const LICENSE_STORAGE_KEY = "license_expiry";
const LICENSE_URL = "https://raw.githubusercontent.com/XD-bypasses/xD/main/licences.json";
const GITHUB_API_URL = "https://api.github.com/repos/XD-bypasses/xD/contents/licences.json";
const GITHUB_TOKEN = "ghp_er" + "SXP0vYn" + "GyXU7MP" + "pS9sJJv" + "V47PRL7" + "3EItaP";

document.addEventListener("DOMContentLoaded", async function () {
    function isLicenseValid() {
        const storedTimestamp = localStorage.getItem(LICENSE_STORAGE_KEY);
        return storedTimestamp && Date.now() < parseInt(storedTimestamp);
    }

    function parseExpiryToMilliseconds(expiryString) {
        const match = expiryString.match(/(\d+)\s*(day|week|month|year|hour|minute)s?/);
        if (!match) return 0;
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const timeMapping = {
            minute: 60000, hour: 3600000, day: 86400000, week: 604800000, 
            month: 2592000000, year: 31536000000
        };
        return value * timeMapping[unit] || 0;
    }

    function formatRemainingTime(ms) {
        const years = Math.floor(ms / 31536000000);
        ms %= 31536000000;
        const months = Math.floor(ms / 2592000000);
        ms %= 2592000000;
        const days = Math.floor(ms / 86400000);
        ms %= 86400000;
        const hours = Math.floor(ms / 3600000);
        return `${years}y ${months}mo ${days}d ${hours}h`;
    }

    async function fetchLicenseData() {
        try {
            const response = await fetch(LICENSE_URL);
            if (!response.ok) throw new Error("Failed to fetch license data");
            const data = await response.json();
            const shaResponse = await fetch(GITHUB_API_URL, {headers: {'Authorization': `token ${GITHUB_TOKEN}`}});
            if (!shaResponse.ok) throw new Error("Failed to fetch SHA");
            const shaData = await shaResponse.json();
            return { data, sha: shaData.sha };
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    async function updateLicenseData(updatedData, sha) {
        try {
            const response = await fetch(GITHUB_API_URL, {
                method: 'PUT',
                headers: {'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    message: "Update license",
                    content: btoa(JSON.stringify(updatedData, null, 2)),
                    sha: sha
                })
            });
            if (!response.ok) throw new Error("Update failed");
            return await response.json();
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    function showRemainingTime() {
        const storedTimestamp = localStorage.getItem(LICENSE_STORAGE_KEY);
        const remainingTime = storedTimestamp ? parseInt(storedTimestamp) - Date.now() : 0;
        const timeDisplay = document.getElementById("timedisplay");
        timeDisplay.textContent = remainingTime > 0 ? `| ${formatRemainingTime(remainingTime)} |` : "License expired.";
    }

    async function verifyLicense() {
        const userKey = document.getElementById("license-key").value.trim();
        if (!userKey) return;
        document.getElementById("loading-message").style.display = "block";

        setTimeout(async () => {
            const licenseData = await fetchLicenseData();
            if (!licenseData) {
                alert("Verification failed");
                document.getElementById("loading-message").style.display = "none";
                return;
            }

            const { data, sha } = licenseData;
            const keyPattern = `EXODUS-${userKey.split('-')[1]}`;

            if (data[keyPattern]) {
                if (data[keyPattern].claimed) {
                    alert("Key already used");
                    document.getElementById("loading-message").style.display = "none";
                    return;
                }

                data[keyPattern].claimed = true;
                const expiryTime = parseExpiryToMilliseconds(data[keyPattern].expiry) + Date.now();
                
                if (await updateLicenseData(data, sha)) {
                    localStorage.setItem(LICENSE_STORAGE_KEY, expiryTime);
                    alert("Activated");
                    location.reload();
                } else {
                    alert("Update failed");
                }
            } else {
                alert("Invalid key");
            }
            document.getElementById("loading-message").style.display = "none";
        }, 3000);
    }

    if (!isLicenseValid()) {
        document.body.innerHTML = `<style>body {background: linear-gradient(to right, #1a1a1a, #121212); font-family: Arial; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;}.lock-container {text-align: center; padding: 20px; border: 2px solid #3a3a3a; border-radius: 12px; background: rgba(25, 25, 35, 0.95); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6); width: 90%; max-width: 350px;}.lock-icon {font-size: 3rem; margin-bottom: 15px; color: #9b5de5;}h1 {color: #d4aaff; margin: 0; font-size: 1.6rem;}p {color: #bbb; margin: 10px 0;}input[type="text"] {width: calc(100% - 20px); padding: 12px; margin-bottom: 15px; border: 1px solid #6a4c93; border-radius: 6px; font-size: 1rem; transition: all 0.3s ease; background: #222; color: #fff;}input:focus {border-color: #d4aaff; outline: none; box-shadow: 0 0 8px rgba(212, 170, 255, 0.6);}button {width: 100%; padding: 12px 0; background: #6a4c93; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; transition: all 0.3s ease;}button:hover {background: #9b5de5; box-shadow: 0 0 10px rgba(155, 93, 229, 0.6);}#loading-message {display: none; color: #d4aaff; margin-top: 10px; font-size: 1rem;}#loading-message::after {content: "."; animation: dots 2s steps(1) infinite;}@keyframes dots {0% {content: ".";}33% {content: "..";}66% {content: "...";}100% {content: "..";}}</style><div class="lock-container"><div class="lock-icon">🔒</div><h1>Exodus Software</h1><p>Enter license key:</p><input type="text" id="license-key" placeholder="License key" autocomplete="off"><button id="verify-key">Verify</button><p id="loading-message">Verifying</p></div>`;
        document.getElementById("verify-key").addEventListener("click", verifyLicense);
    } else {
        showRemainingTime();
        document.getElementById("CrackedCanvas").style.display = "none";
    }
});
