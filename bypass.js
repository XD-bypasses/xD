const LICENSE_STORAGE_KEY = "license_expiry";
const LICENSE_URL = "https://raw.githubusercontent.com/XD-bypasses/xD/main/licences.json"; 
const GITHUB_API_URL = "https://api.github.com/repos/XD-bypasses/xD/contents/licences.json";
const GITHUB_TOKEN = "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";

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
            minute: 60000,
            hour: 3600000,
            day: 86400000,
            week: 604800000,
            month: 2592000000,
            year: 31536000000
        };

        return value * timeMapping[unit] || 0;
    }

    function formatRemainingTime(ms) {
        const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
        ms %= (1000 * 60 * 60 * 24 * 365);
        const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30));
        ms %= (1000 * 60 * 60 * 24 * 30);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        ms %= (1000 * 60 * 60 * 24);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        return `${hours}h ${days}d ${months}m ${years}y`;
    }

    async function fetchLicenseData() {
        try {
            const response = await fetch(LICENSE_URL);
            if (!response.ok) throw new Error("Failed to fetch license data");
            return await response.json();
        } catch (error) {
            console.error("Error fetching license data:", error);
            return null;
        }
    }

    async function getFileSha() {
        try {
            const response = await fetch(GITHUB_API_URL, {
                headers: { Authorization: `token ${GITHUB_TOKEN}` }
            });
            if (!response.ok) throw new Error("Failed to fetch file metadata");
            const data = await response.json();
            return data.sha;
        } catch (error) {
            console.error("Error fetching file SHA:", error);
            return null;
        }
    }

    async function updateUsedKey(userKey) {
        const sha = await getFileSha();
        if (!sha) return;

        try {
            let fileData = await fetchLicenseData();
            if (!fileData) return;

            // Update the license key to USEDKEY-##### format
            const usedKey = `USEDKEY-${userKey.split('-')[1]}`;

            if (fileData[userKey]) {
                fileData[usedKey] = fileData[userKey];
                delete fileData[userKey];
            }

            const updatedData = JSON.stringify(fileData, null, 2);

            const payload = {
                message: `Mark license key ${userKey} as USEDKEY`,
                content: btoa(updatedData),
                sha
            };

            const response = await fetch(GITHUB_API_URL, {
                method: "PUT",
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update license file");
            console.log("Key successfully updated in the repository.");
        } catch (error) {
            console.error("Error updating license key:", error);
        }
    }

    function showRemainingTime() {
        const storedTimestamp = localStorage.getItem(LICENSE_STORAGE_KEY);
        const remainingTime = storedTimestamp ? (parseInt(storedTimestamp) - Date.now()) : 0;
        if (remainingTime > 0) {
            alert(`You have ${formatRemainingTime(remainingTime)} remaining.`);
        } else {
            alert("Your license has expired.");
        }
    }

    async function verifyLicense() {
        const userKey = document.getElementById("license-key").value.trim();
        if (!userKey) return;

        document.getElementById("loading-message").style.display = "block";

        setTimeout(async () => {
            const data = await fetchLicenseData();
            if (!data) {
                alert("Failed to verify license. Please try again.");
                return;
            }

            const keyPattern = `EXODUS-${userKey.split('-')[1]}`;

            if (data[`USEDKEY-${userKey.split('-')[1]}`]) {
                alert("This key has already been used.");
                return;
            }

            if (data[keyPattern]) {
                const expiryString = data[keyPattern].expiry;
                const expiryTime = parseExpiryToMilliseconds(expiryString);
                const currentTime = Date.now();
                const newExpiryTime = currentTime + expiryTime;

                localStorage.setItem(LICENSE_STORAGE_KEY, newExpiryTime);

                alert("KEY ACTIVATED!");

                await updateUsedKey(userKey);
                location.reload();
            } else {
                alert("Invalid license key.");
            }

            document.getElementById("loading-message").style.display = "none";
        }, 3000);
    }

    if (!isLicenseValid()) {
        document.body.innerHTML = `
            <div class="lock-container" style="text-align:center; padding: 20px; border: 2px solid #333; border-radius: 10px; background: rgba(0, 0, 0, 0.7); color: #fff;">
                <div class="lock-icon" style="font-size: 3rem; margin-bottom: 15px;">&#128274;</div>
                <h1 style="color: #FF9F00;">Exodus Software</h1>
                <p style="color:white;">Please type your key below:</p>
                <input type="text" id="license-key" placeholder="Enter your license key" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; font-size: 1.2rem;">
                <button id="verify-key" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; font-size: 1.2rem; cursor: pointer; transition: background-color 0.3s ease;">Verify Key</button>
                <p id="loading-message" style="display:none; color: white;">Please wait...</p>
            </div>
        `;
        document.getElementById("verify-key").addEventListener("click", verifyLicense);
    } else {
        showRemainingTime();
    }
});
