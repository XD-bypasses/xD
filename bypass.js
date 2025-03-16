localStorage.setItem("adminPassword", "true");

document.addEventListener("DOMContentLoaded", async function () {
    const LICENSE_STORAGE_KEY = "license_expiry";
    const DISCORD_USERNAME_KEY = "discord_username";
    const LICENSE_URL = "https://pastebin.com/raw/j3vheTf5";

    const fogStyle = document.createElement("style");
    fogStyle.innerHTML = `
        .fog {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            animation: fog 10s infinite alternate;
            z-index: 0;
        }
        @keyframes fog {
            0% { transform: translateX(0) translateY(0); opacity: 0.1; }
            100% { transform: translateX(100vw) translateY(100vh); opacity: 0.3; }
        }
    `;
    document.head.appendChild(fogStyle);

    const lockContainer = document.createElement("div");
    lockContainer.classList.add("lock-container");
    lockContainer.style = "border: 2px solid white; padding: 20px; width: 350px; margin: 0 auto; border-radius: 15px; background: rgba(0, 0, 0, 0.7); text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); transition: all 0.3s ease;";
    lockContainer.innerHTML = `
        <div class="lock-icon" style="font-size: 4rem; margin-bottom: 15px;">&#128274;</div>
        <h1 style="color: #FF9F00; font-size: 24px;">Exodus Software</h1>
        <p style="color: #fff; font-size: 16px; margin-bottom: 20px;">Exodus is a protected software made by Linux (or Garlic Sauce). This software needs verification to access. Please type your key below.</p>
        <input type="text" id="license-key" placeholder="Enter your license key" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem; background: #333; color: white;">
        <button id="verify-key" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; width: 100%; transition: background-color 0.3s ease;">Verify Key</button>
        <p id="loading-message" style="display:none; color: white;">Please wait up to 3 seconds...</p>
    `;

    function clearPageContent() {
        document.body.innerHTML = "";
    }

    function isLicenseValid() {
        const storedTimestamp = localStorage.getItem(LICENSE_STORAGE_KEY);
        return storedTimestamp && Date.now() < parseInt(storedTimestamp);
    }

    async function fetchLicenseData() {
        try {
            const response = await fetch(LICENSE_URL);
            if (!response.ok) throw new Error("Failed to fetch license data");
            return await response.text();
        } catch (error) {
            console.error("Error fetching license data:", error);
            return null;
        }
    }

    function parseLicenseData(data) {
        const licenses = {};
        const entries = data.split("}\n");
        entries.forEach(entry => {
            const keyMatch = entry.match(/key:(\S+)/);
            const timeMatch = entry.match(/time:(.+)/);
            if (keyMatch && timeMatch) {
                const key = keyMatch[1].trim();
                const time = timeMatch[1].trim();
                licenses[key] = parseTimeToMs(time);
            }
        });
        return licenses;
    }

    function parseTimeToMs(time) {
        const match = time.match(/(\d+)\s*(day|year|month|hour|minute)/i);
        if (!match) return 0;
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        const timeMapping = {
            minute: 60000,
            hour: 3600000,
            day: 86400000,
            month: 2592000000,
            year: 31536000000
        };

        return value * (timeMapping[unit] || 0);
    }

    function formatRemainingTime(ms) {
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    function showRemainingTime() {
        const storedTimestamp = localStorage.getItem(LICENSE_STORAGE_KEY);
        const remainingTime = storedTimestamp ? (parseInt(storedTimestamp) - Date.now()) : 0;
        alert(`You have ${formatRemainingTime(remainingTime)} remaining.`);
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

            const licenses = parseLicenseData(data);

            if (licenses[userKey]) {
                const expiryTime = Date.now() + licenses[userKey];
                localStorage.setItem(LICENSE_STORAGE_KEY, expiryTime);
                alert("KEY ACTIVATED!");

                const remainingTime = formatRemainingTime(expiryTime - Date.now());

                let discordUsername = localStorage.getItem(DISCORD_USERNAME_KEY);

                if (!discordUsername) {
                    discordUsername = prompt("Enter your Discord username:");
                    if (discordUsername) {
                        localStorage.setItem(DISCORD_USERNAME_KEY, discordUsername);
                    }
                }

                showRemainingTime();

                lockContainer.remove();
                fogStyle.remove();
                location.reload();
            } else {
                alert("Invalid license key. Please try again.");
            }

            document.getElementById("loading-message").style.display = "none";
        }, 3000);
    }

    if (!isLicenseValid()) {
        clearPageContent();
        document.body.appendChild(lockContainer);
        document.getElementById("verify-key").addEventListener("click", verifyLicense);
    } else {
        fogStyle.remove();
        showRemainingTime();
    }
});
