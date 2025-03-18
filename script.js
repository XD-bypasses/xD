document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        let label = document.createElement("label");
        label.classList.add("switch");

        let slider = document.createElement("span");
        slider.classList.add("slider");

        checkbox.parentNode.insertBefore(label, checkbox);
        label.appendChild(checkbox);
        label.appendChild(slider);
    });
});

let optionButtons = document.querySelectorAll(".option")

function HideAll() {
    optionButtons.forEach(button => {
        let dataName = button.getAttribute("data-name")
        document.getElementById(dataName).style.display = "none";
        button.classList.remove("selected");
    })
}

optionButtons.forEach((button) => {
    let dataName = button.getAttribute("data-name")
    let thisButton = button;
    button.addEventListener("click", () => {
        HideAll()
        document.getElementById(dataName).style.display = "block";
        thisButton.classList.add("selected");
    })
})

document.getElementById("show-all-extensions").addEventListener("change", function() {
    extContainer.innerHTML = "";
    createExtensionButtons();
});

let devModeToggle = document.getElementById("developer-mode");
devModeToggle.checked = false;

devModeToggle.addEventListener("change", (ev) => {
    console.log("Dev Mode On: " + devModeToggle.checked);

    if (devModeToggle.checked) {
        devModeToggle.checked = confirm("Are you sure you want to enable developer mode? This is intended only for people who know what they are doing!");
        if (!devModeToggle.checked) {
            document.getElementById("dev-settings").style.display = "none";
            return;
        }
    } else {
        document.getElementById("dev-settings").style.display = "none";
        return;
    }

    document.getElementById("dev-settings").style.display = "block";

    document.getElementById("add-ext").addEventListener("click", async () => {
        this.blur();
        let name = prompt("Extension Name");
        let url = prompt("Frame URL (must be under web_accessible_resources)");
        console.log(url);
        let icon = prompt("Icon URL (optional)");

        let success = await TryAddExtension(name, icon, url);
        if (success) {
            alert("Successfully added extension!");
        } else {
            alert("Failed to add extension :(");
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("div.option").classList.add("selected");
});

document.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", function(e) {
        this.querySelectorAll(".ripple").forEach(ripple => ripple.remove());

        let ripple = document.createElement("span");
        ripple.classList.add("ripple");

        let rect = this.getBoundingClientRect();
        let size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;

        let x = e.clientX - rect.left - size / 2;
        let y = e.clientY - rect.top - size / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

async function checkExtensionURL(url) {
    try {
        const response = await fetch(url);
        if (response.ok) return true;
    } catch (error) {

    }

    try {
        const response = await fetch(url, {
            method: 'HEAD'
        });
        if (response.ok) return true;
    } catch (error) {

    }

    return false;
}

function getExtensionId(url) {
    const regex = /^chrome-extension:\/\/([^\/]+)/;
    const match = url.match(regex);
    return match ? match[1] : 'Unknown ID';
}

const extContainer = document.getElementById("div-container");
async function TryAddExtension(name, icon, url) {
    let showAll = document.getElementById("show-all-extensions").checked;

    if (showAll || await checkExtensionURL(url)) {
        const div = document.createElement("div");
        div.classList.add("extension-container");

        const img = document.createElement("img");
        img.src = icon || "https://raw.githubusercontent.com/Blobby-Boi/XD-bypass/refs/heads/main/extension.png";
        img.onerror = function() {
            this.src = "https://raw.githubusercontent.com/Blobby-Boi/XD-bypass/refs/heads/main/extension.png";
        };
        img.alt = `${name} Icon`;
        img.style.userSelect = "none";

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("extension-info");

        const nameText = document.createElement("span");
        nameText.classList.add("extension-name");
        nameText.textContent = name;

        const idText = document.createElement("span");
        const extensionId = getExtensionId(url);
        idText.classList.add("extension-id");
        idText.textContent = `ID: ${extensionId}`;

        const button = document.createElement("button");
        button.textContent = "Disable";
        button.style.userSelect = "none";
        button.onclick = () => createPopup(name, icon, url, extensionId);

        infoDiv.appendChild(img);
        infoDiv.appendChild(nameText);
        div.appendChild(button);
        div.appendChild(idText);
        div.appendChild(infoDiv);
        extContainer.appendChild(div);

        return true;
    }
}

const extensions = {
    "Securly (4th ID)": "chrome-extension://lcgajdcbmhepemmlpemkkpgagieehmjp/fonts/Metropolis.css",
    "Securly (3rd ID)": "chrome-extension://ckecmkbnoanpgplccmnoikfmpcdladkc/fonts/Metropolis.css",
    "Securly (2nd ID)": "chrome-extension://joflmkccibkooplaeoinecjbmdebglab/fonts/Metropolis.css",
    "Securly (1st ID)": "chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/fonts/Metropolis.css",
    "GoGuardian": "chrome-extension://haldlgldplgnggkjaafhelgiaglafanh/youtube_injection.js",
    "LANSchool": "chrome-extension://baleiojnjpgeojohhhfbichcodgljmnj/blocked.html",
    "Linewize": "chrome-extension://ddfbkhpmcdbciejenfcolaaiebnjcbfc/background/assets/pages/default-blocked.html",
    "Blocksi": "chrome-extension://ghlpmldmjjhmdgmneoaibbegkjjbonbk/pages/blockPage.html",
    "FortiGuard": "chrome-extension://igbgpehnbmhgdgjbhkkpedommgmfbeao/youtube_injection.js",
    "Cisco Umbrella": "chrome-extension://jcdhmojfecjfmbdpchihbeilohgnbdci/blocked.html",
    "ContentKeeper": "chrome-extension://jdogphakondfdmcanpapfahkdomaicfa/img/ckauth19x.png",
    "CK-Authenticator G3": "chrome-extension://odoanpnonilogofggaohhkdkdgbhdljp/img/ckauth19x.png",
    "Securly Classroom (2nd ID)": "chrome-extension://hkobaiihndnbfhbkmjjfbdimfbdcppdh/notfound.html",
    "Securly Classroom (1st ID)": "chrome-extension://jfbecfmiegcjddenjhlbhlikcbfmnafd/notfound.html",
    "Hapara (2nd ID)": "chrome-extension://kbohafcopfpigkjdimdcdgenlhkmhbnc/blocked.html",
    "Hapara (1st ID)": "chrome-extension://aceopacgaepdcelohobicpffbbejnfac/blocked.html",
    "iboss": "chrome-extension://kmffehbidlalibfeklaefnckpidbodff/restricted.html",
    "Lightspeed Digital Insight Agent": "chrome-extension://njdniclgegijdcdliklgieicanpmcngj/js/wasm_exec.js",
    "Lightspeed Filter Agent": "chrome-extension://adkcpkpghahmbopkjchobieckeoaoeem/icon-128.png",
    "Lightspeed Classroom": "chrome-extension://kkbmdgjggcdajckdlbngdjonpchpaiea/assets/icon-classroom-128.png",
    "InterCLASS Filtering Service": "chrome-extension://jbddgjglgkkneonnineaohdhabjbgopi/pages/message-page.html",
    "InterSafe GatewayConnection Agent": "chrome-extension://ecjoghccnjlodjlmkgmnbnkdcbnjgden/resources/options.js",
    "LoiLo Web Filters": "chrome-extension://pabjlbjcgldndnpjnokjakbdofjgnfia/image/allow_icon/shield_green_128x128.png",
    "Gopher Buddy": "chrome-extension://cgbbbjmgdpnifijconhamggjehlamcif/images/gopher-buddy_128x128_color.png",
    "LanSchool Web Helper": "chrome-extension://honjcnefekfnompampcpmcdadibmjhlk/blocked.html",
    "IMTLazarus": "chrome-extension://cgigopjakkeclhggchgnhmpmhghcbnaf/models/model.json",
    "Impero Backdrop": "chrome-extension://jjpmjccpemllnmgiaojaocgnakpmfgjg/licenses.html",
    "Mobile Guardian": "chrome-extension://fgmafhdohjkdhfaacgbgclmfgkgokgmb/block.html",
    "NetSupport School Student": "chrome-extension://gcjpefhffmcgplgklffgbebganmhffje/_locales/lt/messages.json",
    "classroom.cloud Student": "chrome-extension://mpkdoimpgkhjcicmhmlmgboelebflpla/_locales/lt/messages.json",
    "Lockdown Browser": "chrome-extension://fogjeanjfbiombghnmkmmophfeccjdki/manifest.json",
    "Linewize Filter": "chrome-extension://ifinpabiejbjobcphhaomiifjibpkjlf/chat/assets/imgs/pendo.png",
    "Borderless Classroom Student": "chrome-extension://kdpgkligilplaanoablcpjahjjeghcl/pages/blockPage.html",
    "LockDown Browser AP Classroom Edition": "chrome-extension://djpknfecbncogekjnjppojlaipeobkmo/assets/images/icon_128.png",
    "Lugus School": "chrome-extension://eoobggamkobbcpiojefejfglbfcacgca/assets/images/icon_128.png",
};

const icons = {
    "Securly (4th ID)": "https://resources.finalsite.net/images/f_auto,q_auto/v1624943346/d70k12ilus/t0iwdjo2upb1hwmylkk3/securly-180x180.png",
    "Securly (3rd ID)": "https://resources.finalsite.net/images/f_auto,q_auto/v1624943346/d70k12ilus/t0iwdjo2upb1hwmylkk3/securly-180x180.png",
    "Securly (2nd ID)": "https://resources.finalsite.net/images/f_auto,q_auto/v1624943346/d70k12ilus/t0iwdjo2upb1hwmylkk3/securly-180x180.png",
    "Securly (1st ID)": "https://resources.finalsite.net/images/f_auto,q_auto/v1624943346/d70k12ilus/t0iwdjo2upb1hwmylkk3/securly-180x180.png",
    "GoGuardian": "data:image/png;base64,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",
    "LANSchool": "https://lh3.googleusercontent.com/kcLanDJig1YZotCQ2TvYeV0HO_QltVJ35Gy8Noh3azWipBv3BX2b0MZkXe-1CfSb0mwlc5UF73h8uuDi8X6k0wwKhQ=s60",
    "Linewize": "https://lh3.googleusercontent.com/u7Cj8iGu2nbpt1MRge2xIdod7o-BRObXpprLyqEvIuLlj8Jy1V6qAIKyWJc78TQIQzzw4khn_azNImWo7E8hqTs0=s60",
    "Blocksi": "https://lh3.googleusercontent.com/6XAFCbc488sQ37rqRZA32TON_Jl1D4F8JAkY3bAa22z3YcjYfdji2iEMI70PIDhMJ8ZzyjQRj639Cln2Wk3alNXFMQ=s60",
    "FortiGuard": "https://lh3.googleusercontent.com/i0fVMSdHigyktkc6nBx_A9sFNdjSo-FomWAN12QMwEWoOKbGEb39pkvUw2ToXauiva94R6wt_bfPKDE_migNopiIKk4=s60",
    "Cisco Umbrella": "https://lh3.googleusercontent.com/V-JDXkLHP6OFeSqW6Py3Z1DbGUrGPshSJdgt8ToXWYAoKdyXVPxT1b_hqJf8Hg4SS1ZvMZK6RyxnyNt3UXKuuZok=s60",
    "ContentKeeper": "https://lh3.googleusercontent.com/gm8Uu8gxlV4H7KgpmxbuUs5lJ1wPoolDe_6wTDbp_TCOvvq_tPiujtmF5jTzynIsiHH5nkmE0dplINhBtBa0Ju6QXw=s60",
    "CK-Authenticator G3": "https://lh3.googleusercontent.com/qlSbMmkMjnIrUP_H6NPTDh586hTL2GLLolVjt6YY7HszbeHrfcsQJsSYD5Mb0-GQwRu9qFkRmvGiKJ5YSsb7KDs9hw=s60",
    "Securly Classroom (2nd ID)": "data:image/jpeg;base64,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",
    "Securly Classroom (1st ID)": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEQEBIQEBIQDxAQEA8PDg0QDw8PDQ8NFRIXFhURExMYKCggGBolGxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi0fHR0vKy0tLS0wLSstLS0tKy0tLS0tLSsrLS0tLTctLS03KystLSsrNystLSsrKystKystN//AABEIANMA7wMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcCBAUDAf/EADgQAAIBAQQEDAYCAwEBAAAAAAABAgMEBQYRITEzchIWMkFRUmFxgZGhsQcUFSJCglOSE2LBNCP/xAAaAQEAAgMBAAAAAAAAAAAAAAAABQYCAwQB/8QAJhEAAgEDAwQDAQEBAAAAAAAAAAECAwQRMTJREhMUQQUhcTMiYf/aAAwDAQACEQMRAD8AvEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGFaqorNnsYt6HjeDkWnEtCm8pN68tR1Qs6ktDmld046njxus3TLyM/AqmPm0xxus3TLyHgVR5tMcbrN0y8h4FUebTHG6zdMvIeBVHm0xxus3TLyHgVR5tMcbrN0y8h4FUebTHG6zdMvIeBVHm0z2pYmoS1N+Rg7OojJXdNnRs9thPkmiVNx1N8ailobJrMwAAAAedWsorNmSi2YuSRzq9/0Ya2/I3xtZy0NMrmC1NV4tsy55eRs8Cqa/NpnzjdZumXke+BVHm0xxus3TLyHgVR5tMcbrN0y8h4FUebTHG6zdMvIeBVHm0xxus3TLyHgVR5tMcbrN0y8h4FUebTMqeK7PJ5Jy8jx2NVHqvKbOrZLbCryc9KzOadNw1N8KilobJrNgAAAAOXiKpwaOa6UdNqszNFw8QKYvi3zlUmuFLROXP2lsoUoqK+isVqjcn9mh8zPrS8zd0R4NPXLkfMz60vMdEeB1y5HzM+tLzHRHgdcuR8zPrS8x0R4HXLkfMz60vMdEeB1y5HzM+tLzHRHgdcuR8zPrS8x0R4HXLk2aF5Tj+UvNmuVGL9GyNVr2dy7cUyg0s561+Rx1bFS4OqleNck6uXEKqJZ568tLIavaOJLULlSJNQrKSzRHyjg7oyyekpZHiR7k416XvGmufn5zqpW7kc9WuokDvjFjzyTnpXWJqhYLX6IitevQjdqvmc/wAp+ZIQt4x9HDKu2aErVNvlS8zcoR4NTnLk+fMz60vMdEeDzrlyPmZ9aXmOiPA65cj5mfWl5jojwOuXI+Zn1peY6I8DrlyPmZ9aXmOiPA65cj5mfWl5jojwOuXJnStk4vPhS8zyVOLWhkqkk9S08CWpzUc239j1vtK38jBRbJ+wm5JE0IkkwAAAAcfFGw8UdVp/Q5rrYUheO1qb8vcuFLYirVN7PKlT4TMpPBilk6dG5pyWajL+rOeVxFezfGhJmf0Op1Z/1Zj5UeTLx5cD6HU6s/6seVHkePLgfQ6nVn/Vjyo8jx5cD6HU6s/6seVHkePLg8rRc1SKzUJv9WZxuIN6mMqEktDRnZKi1wku9M3KpF+zS4SXo8mmuwyMTasNslTknm9Dz1mupTUkbIVHFliYUxHwuDGWS16XIgbyzxlombS6zhM7N+39GnBNcF5vLldhy29q5S+zqr3KjH6Kwvm95VZc60y1MsVC3UEQNau5s47bfadRzGcKEnqi33Jnjklqz1Rb0Rt2a66snyJr9Wap14L2bY0ZP0bX0Op1Z/1Zq8qPJs8eXA+h1OrP+rHlR5Hjy4H0Op1Z/wBWPKjyPHlwPodTqz/qx5UeR48uA7jqdWf9WPKjyPHlwc+02Vw1prvR0RmpGiUHE1jYay0vh3qjuP3K38n7/SwfHevwnpCksAAAADj4o2HijqtP6HNdbCkLx2tTfl7lwpbEVapvZtXLDOa3omu4eImygsst64rBB0s9Osq1xVakWOhTTidL6bDt9Dn70jd2kPpsO30HekO0h9Nh2+g70h2kPpsO30HekO0j5K64Pp9D1V5DsxOLemHIz1KWvsOujeOJy1bVMgN+YclTeajLnekm7e8UvZEV7VxIxOm1rJBPJwtYNmxWt02mjCpTUjOE+k2LXecprJ5GuFFRZnOq5I5utnRoaNTq3RdEqslob05aDmrXCgjoo0HNlgXLhdRSbUufoIS4vW9CYoWaWpJ6F0Qilr9COlcSbO6NCKPX6bDt9DDvSMu1EfTYdvoO9IdpD6bDt9B3pDtIfTYdvoO9IdpGNW7ocF69T6DKNaWTx0o4KsxbRUZaOqyx2Um0QN3FJkSJQjS0vh3qjuP3K38n7/SwfHevwnpCksAAAADj4o2HijqtP6HNdbCkLx2tTfl7lwpbEVapvZuXFtI70fc1XG1myhuLnw/svEqVzvLPb7TqHObwAAAAAAAc687shVi81m8nlpZvo1pQZoq0YyRVOJ7mdGWrL7c9efOyy2lz1ogLq36GRdrIkTgB6eHRumxOpJLLPSjnrVOlG+lT6mWxhy4YUo5yjp4Wa0voKzdXTm/plhtrZRX2iSxikskcDeTtSwfTw9AAAAAAMK3Jfcz2Op49CpMY8r9WWex0K7eakOJYjC0vh3qjuP3K38n7/SwfHevwnpCksAAAADj4o2HijqtP6HNdbCkLx2tTfl7lwpbEVapvZuXFtI70fc1XG1myhuLnw/svEqVzvLPb7TqHObwAAAAAAAGgCKYwu9TjKWS0Q/6ySsari0iPvKXUslSXjS4NRruLPSlmOSu1FiWDWRsMCwcH3Ym88l+DIS+rY+iYs6OfssynHJFebyTiRkeHoAAAAAAAMK3Jfcz2Op49CpMY8r9WWex0K7eakOJYjC0vh3qjuP3K38n7/SwfHevwnpCksAAAADj4o2HijqtP6HNdbCkLx2tTfl7lwpbEVapvZuXFtI70fc1XG1myhuLnw/svEqVzvLPb7TqHObwAAAAAAAADn33Tzozf+pvt3iaNNdf4ZSWIVlXl3L2LfbfzRVrjeznR1rvN7NJcOCKS4D7of9Kr8hL7LJYr6JaRhIgAAAAAAAAGFbkvuZ7HU8ehUmMeV+rLPY6FdvNSHEsRhaXw71R3H7lb+T9/pYPjvX4T0hSWAAAABx8UbDxR1Wn9DmuthSF47Wpvy9y4UtiKtU3s3Li2kd6PuarjazZQ3Fz4f2XiVK53lnt9p1DnN4AAAAAAAABpXxsJ7ptof0RqrbGUhiP/ANEu5excLX+aKtc/0ZzY613nQzQi5cD8iW7D/pVPkNyLNY6MlJGneAAAAAAAAAYVuS+5nsdTx6FSYx5X6ss9joV281IcSxGFpfDvVHcfuVv5P3+lg+O9fhPSFJYAAAAHHxRsPFHVaf0Oa62FIXjtam/L3LhS2Iq1TezcuLaR3o+5quNrNlDcXPh/ZeJUrneWe32nUOc3gAAAAAAAAGlfOwnum6h/RGqtsZSGIv8A0S7l7Fvtf5oq1z/RnNjrR0M0Ft4KtcVFrPmh/wBKxf022WKymkiYRqJkVhklkzPD0AAAAAAAGFbkvuZ7HU8ehUmMeV+rLPY6FdvNSHEsRhaXw71R3H7lb+T9/pYPjvX4T0hSWAAAABx8UbDxR1Wn9DmuthSF47Wpvy9y4UtiKtU3s3Li2kd6PuarjazZQ1Lnw/svEqVzvLPb7TqHObwAAAAAD45I9weZNO03lCnrz8MjZCjKWhrlVUSN35imk4SilLTHsJC3sZ9SZxV7yPS0Vbe1dVKrkufLWWOjHphggKsuqWTTNxqOlYr4q0+TOS1ajnqW8J6o3wryjoyWXBiuWaVSU5fd2aiMubFYzFEjb3rz/plg3beMaqWWenPXkQdWi4MmKVVSR0DQbgAAAAADCtyX3M9jqePQqTGPK/VlnsdCu3mpDiWIwtL4d6o7j9yt/J+/0sHx3r8J6QpLAAAAA4+KNh4o6rT+hzXWwpC8drU35e5cKWxFWqb2blxbSO9H3NVxtZsoalz4f2XiVK53lnt9p1DnN4APjYB4VrWo68vMzjTbMJTSOTb7+hFPV/ZHVTtZNnPUuUiK3pivLVnr5pElRseSPq3hF7XiSc+tz/kSMLOMTgndtnHrWqUud+Z1Rgkc0ptniZmJnCi2YuSR6otnydJo9UshrApVXFprPQHFNBPDJ9gy9XnFPP8ALnIS/oasl7KtoWVZ58KKfSiAksPBNxeVk9DEyAAAABhW5L7mex1PHoVJjHlfqyz2OhXbzUhxLEYWl8O9Udx+5W/k/f6WD471+E9IUlgAAAAcfFGw8UdVp/Q5rrYUheO1qb8vcuFLYirVN7Ny4tpHej7mq42s2UNxc+H9l4lSud5Z7fadQ5zeeFotUYLS0u9mcYOWhhKaRE74xYqeiDhLXzknQsHLUj616o6EQvHF06mayjpWWhslKVhGJG1L2UiOWu2ym23z9p3wpqJxTqORrNmzBgfY029SbDaQSbNuhddaTWVOWXcapV4JamyNGb9EjurCcp5cJTjr5jgrX6jpg7qVk5akpseCqaS+6eroRGz+Sk3od8LCKRxcQ4ahTWactUnzHXbXkpM5bi0UUQBk2RB3sN1Mpx8Tju45izrtn9ouW6HnRhuoqdfeyzUdiNw1GwAAAAGFbkvuZ7HU8ehUmMeV+rLPY6FdvNSHEsRhaXw71R3H7lb+T9/pYPjvX4T0hSWAAAABx8UbDxR1Wn9DmuthSF47Wpvy9y4UtiKtU3s3Li2kd6PuarjazZQ1Lnw/svEqVzvLPb7To1Z8FZmhLLNzeCvcW37wW0pLlNaicsrXP20Q93c4K8r2qUm8+0nYwSIaU2zyUWzPODDU9qdinLUjB1IozVNs7V3YcnU1werpRx1byMfZ1U7Vy9Epu/BuWlwfN+SI6r8jn2d9Ow/4Siw3FCGtPX0kdUunI74W8UdWlZYx1HM5tm9QSPbUjEyIJjC8EllnzTWombGk85Iq8qrQq2WssaIA72GaLc4+JxXcsRZ12sctFyXTHKjBf6oqlZ5myzUtiNw1GwAAAAGFbkvuZ7HU8ehUmMeV+rLPY6FdvNSHEsRhaXw71R3H7lb+T9/pYPjvX4T0hSWAAAABx8UbDxR1Wn9DmuthSF47Wpvy9y4UtiKtU3s3Li2kd6PuarjazZQ1Lnw/svEqVzvLPb7TK/6zhRbWjShbR6p4Fd4hkpvEVoc5yzef3stdrDpiitXMss5FOHCaXS0jqbwsnMll4JfceFpzyb4LWfSyKuL6MfokqFnKRNrrwvTjlw4ResiK17J6MlKVpFao7lG7KUOTBI45Vpy1Z1xpQWiNuMUtRrybD6eAAGvbayhHNmdOPUzCcsIqDF9tcprJvXP/AIWmyp4RXLyplkYSzJE4CeYFsHCcG0vyIX5CrjJLWNPOCzqEODFLoRXpPLyT0VhYPQxPQAAAAYVuS+5nsdTx6FSYx5X6ss9joV281IcSxGFpfDvVHcfuVv5P3+lg+O9fhPSFJYAAAAHHxRsPFHVaf0Oa62FIXjtam/L3LhS2Iq1TezcuLaR3o+5quNrNlDcXPh/ZeJUrneWe32nzEkM6DXaj21eKh5crMCmb9p5TlvMtlu8xRWa6w2c+zyynF9DRvkspmmLw0WhhK8otJZfl09hXL2i0yetKqwTinJNZoh2sEqvszPD0AAAAEfxda+BSW909h3WVPqmcd3PpiU7elfhy8WWqjHpRWqsss87tpcKrCPSz2rLEGzyksySLfwpYOBGL0c/MVe8q9TZY7Sn0pEnI47wAAAAADCtyX3M9jqePQqTGPK/VlnsdCu3mpDiWIwtL4d6o7j9yt/J+/wBLB8d6/CekKSwAAAAOPijYeKOq0/oc11sKQvHa1N+XuXClsRVqm9m5cXLjvR9zVcbWbKG4ufD+y8SpXO8s9vtPl+2qMabTklpWtntvBuX0eV5pRKgxJWjKcsmn971FptYtJZK5cyTf0cQ7DkJBhirJTjkm/uOG7imnk7bVvKwXDcsm6MW1k9OjxKrXSU3gslF5gjeNJtAAAMajyR6jxlaY2vPNuGj7Zvn0lgsKOP8ARCXtbP0V/N5t95OLQhnqSPCd38OpCWnRNcxH3tXpi0d1pTzJMuC7qXBgkVarLMix01hG0azYAAAAAAYVuS+5nsdTx6FSYx5X6ss9joV281IcSxGFpfDvVHcfuVv5P3+lg+O9fhPSFJYAAAAHIxOv/h4o6rT+hzXWwpG8o5VZ78vct9J/4RVqq/0z0umtwakd6PuY1o5izKlLEkWvdl8QhQf3LPPoK1Vt5SqaFhpV4xhqQzFGIXUlKKaazXMS1paKKTIu6unJtEPqTzbZKJYRGt5PayWWVSSSWelJmM5qK+zOEHJli4Uw9wcm4tZSz19hA3l3n6yTNpa4+yfWenwYpELJ5eSXisI9DEyAAAObe9t/xwbzSyyOihT6maK1TpRTWI7Vw6030zbLXaw6YJFZuZ9U2cujDhPxOmTwjRFZZZuA7uyg2081P/iK98jW/wBYJ2wpf5yTynHJZEK3klkZHh6AAAAAAeVpmlF59DMoLLMZPCKdxfac5pdjLVZQxErd5PLIukSJwFp/DyOiO4/crnyb1/Sf+O9E8IUlgAAAAc++6XCpZdpvt5Ykaa6zEprEll4E5PpnL3LXa1OqKKzcw6WcenLJp9DOtrKOZPB0ne8+A4qT09hz+PHOcG/vvGMnNqVHJ5vSzoSS0NDbZ7WSzubyRhOfSjKEcliYXw1l90orXF62QV3eekyatbT20TyzWZQWSWRCzm5EtGCR7mBmeVaqomUY5MW8GrG8It5Z85s7TwYd1G4p6MzVg2ZIXjm38GnPJ88SX+PpZkiMvqmIsqu0VeFJvpZZIxwsFfk8s37js/Dml/tH3NFxPpibqEcyLmuGxf4oZZZZvP0KncVOuRZqFPoidY5joAAAAAAMZSyPUjzJGMT3wqcUs2s+EiQtLdyZw3VdRRU16Wr/ACSzzLPRh0Ir1WfUzysFLh1FHpMqkumOTCmsywW3gyy8CMdxlYv59TZY7KGEiWEYSAAAAAMKsM1kz1PB41krzGtz8JZrJfc3qJ2wuMakNe0M6FcVIZPInk8kI1gxMjw97JZnUlwV5mE5qKyZwh1PBYeF8PLJOSi/tWuJA3d36RM2tryT+hQUVkklq1IhJSbZMRikexiZHjaLQoLNmcYOTMZS6UQDE+I2m1FyWUnqkTVpZ+2RF1dekQ6hflVTTc55cLPLhPpJaVtDp0RGRuJ9WrJvYMWr/G81JvpzIepYPq+iVp3q6SL4ovj/ADcJLPTlrZI2dv28EfdV+vJFyROAkmHbRCEs3HPTF8xwXUJSX0zutpKL+yx4Ypppcl+aIF2Mn7JtXkeDLjXT6r80eeDLkeZHgca6fVfmh4MuR5keBxrp9V+aHgy5HmR4HGun1X5oeDLkeZHg+SxZTX4vzQVhLkebHg417Ywi1lFSWnpOqj8e8/ZzVb5Y+iA3pes6snnKTWbyTbZOUaEYLQh6tZyepy9Z0GgkmE7sc6sJPLLN6Guxkfe1umDR22lHMky3bss6hBZJauYq9Wbkyx0o4Rumo2gAAAAAHPvWzKUXn2m+jNpmmrDKKMvOOU3vP3LjSf8AkqlXU1ILSbWa0WJgy5lKEKj50+btIK/uGm4kzZUMpMsKyWdQSXZkQU59TJmMcI2DAzNa2WlQTza1dJshByZhOaiiAYrxDyoxyelapE3Z2mjZD3d1qkV/a7S5tt87z1k3CCiiHnPqZ4GwwM4VWjFxTMkzGUsz1LB42fD08PSFZoxccmSlg9vnZdvmYdtGXcY+dl2+Y7aHcY+dl2+Y7aHcY+dl2+Y7aHcY+dl2+Y7aHcZ8dsl2+Z720OtnjKo30mSSRi22fIwbPW8HiR27ouWVSS0S5S/E469yoo66Nu5Ms/DdzqlBZ55pvWsiu3Vx1yJ22odKJFFZHAztPoAAAAAABr21ZxfczOm/swnoUffdkcZvQ9Lk/UuNvUzEqteGGcmD0nSznRYmC7+UIwptxSSffrIK/tctyRM2VzhKLLDstojOKaeehMgpwcX9kzGSkvoWm0xgm28tDYhByf0eykoor/FOI9cYyi/t7Sbs7P2yHurr0ivbXXdSTk9bJ2EVFYRDTl1PJjRoSm8orM9lJR1PFFvQ3oXDaHqpv0NLuqS9m1W1R+jLi9af436Hnl0uT3xavA4vWn+N+g8ulyPFq8Di9af436Dy6XI8WrwOL1p/jfoPLpcjxavA4vWn+N+g8ulyPFq8Di9af436Dy6XI8WrwOL1p/jfoPLpcjxavA4vWn+N+g8ulyPFq8Di9af436Dy6XI8WrwOL1p/jfoPLpcjxavB72bDddvTTl6GErymtGZxtantEmujB6emcZLVzojq/wAg1od1GxT1JxdlzQo6s9aekh6txKepK0qEYaHWOY6AAAAAAAAADCpHNHqeDxrJXGM7nyyaS1Sesn7C4zqQt7QxoV7VpuLyZOJ5IZrB7WO1OnLNPIxqU1JGUJuLJzceKeDFJzfJS1Ihrixy9CVoXmFqY37iptZKb0p8yPbexw/tCveZ9kHtdqc3m3mTEIKKIqc3JmFCg5vJHspJHkY5J3hjDmeUpRWmKetkNd3mPpMlbW1z9tE/s1104rk8y52Qkq8m9SYjRikev06n1fVmPdlyZdqI+nU+r6sd2XI7UR9Op9X1Y7suR2oj6dT6vqx3ZcjtRH06n1fVjuy5HaiPp1Pq+rHdlyO1EfTqfV9WO7LkdqI+nU+r6sd2XI7UR9Op9X1Y7suR2oj6dT6vqx3ZcjtRPqsFNfj6s87sh24ntCjFakYuTZkopHoYmQAAAAAAAAAAABoXpYY1YvNJvJpZo3UargzVVpqaKvxRh9025LLJR1JFjs7tS+mQN1bOP2RCUWiUTI1oyjVktTaPHFMZaPk6jettnqSQbbM7PRcmkucxlLCPYxyyd4Sw3m41JcFpp6GiGvbzGYol7S0zhssWx2SNNJJJZLLQiBqVHJ/ZMwgoo2jWbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAaF4WBVE08tK6MzfSquLNNSmpIgd+4VzlJxz1rVEmbe+wlkia9nl/RHKuGZp/l/U71exZxO0Z9oYZm3+WvqiV7FIRtGyWXFhjg5N56+eJGXF7nQkaFpjUm9isqpxSXNnzEPUm5PJKQh0o2jWbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADyrrQZR1MZHItCWfidUWc8hY0s/ETYgdmmtByM6UZnh6AAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k=",
    "Hapara (2nd ID)": "data:image/jpeg;base64,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",
    "Hapara (1st ID)": "data:image/jpeg;base64,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",
    "iboss": "https://lh3.googleusercontent.com/zaFZuivjaV3VaC8kLZO4HaS2JnnnPY_Zl7vBT8EIax8gnrWaYxP25jh7E2oPGAy_8G7xHEP3NCZomStqgkPdtvT-fA=s60",
    "Lightspeed Digital Insight Agent": "https://lh3.googleusercontent.com/RI-RLYMrCK7AcJ_BiCZSqCq-uJoLGOZxjNgbhuS5V02aJgttYKDfeJSQekVNonjiaBINYjmx5fIA_htQvbXZpfcc-w=s60",
    "Lightspeed Filter Agent": "data:image/png;base64,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",
    "Lightspeed Classroom": "data:image/png;base64,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",
    "InterCLASS Filtering Service": "https://lh3.googleusercontent.com/RrqTiWhnbz_MSgp3YUQujtAHGQXTa_3iApTxEj7zzShDuRnLCal1dJ0rK8qrKMBoHAlA5MVc-Pydod57_IxL9tpjEYI=s60",
    "InterSafe GatewayConnection Agent": "https://lh3.googleusercontent.com/I2As7WwDK3A9zL5WDOhAvRvlg-26Efe58cWcW_prclgcTwvgew0MatntaBfayc5nr99_Bg8jLKBgmDzUP9Mt7H1IJg",
    "LoiLo Web Filters": "https://lh3.googleusercontent.com/6L1jQuVM9fGI_a80y135mKWQmyUB28jA5MsSOj7hDcmJeDiPWS3TfHA3oRxJscYMO6NRugSV5JAe9ppKmjCAo2CN=s60",
    "Gopher Buddy": "https://lh3.googleusercontent.com/NRwK4P2YlJIv08R14JAjDpdrROtEe7BJAXwQ5Gz5jBybBpnDwOirwwkUFP5_Uzn1bCRtZykjySm1v0LjJz7uDdxFnQ=s60",
    "LanSchool Web Helper": "https://lh3.googleusercontent.com/zFDnFbLiv6eByJ3LbvloS6GdW-7mOpan7ocOccEbxYSNJhhtfnVOwiebpf8Ft43uqOc4uUW9SWPMDdRmvB7lOfrYBg=s60",
    "IMTLazarus": "https://lh3.googleusercontent.com/8jCa3CsqyW78IuVt-tzEL1qZsP63EG0VPFTu6z1to760WF43Wo9KZNy7x8bT9kfKNQFIyCiAan-CrmHkGtj_ELghEw=s60",
    "Impero Backdrop": "https://lh3.googleusercontent.com/Pk717OoshMT2IiQs8Gpx7he8EheFOII6UKwFRYDY_KNoaKN35XsIBU9_BgUDhZgvyUGQ2wrjoRQ8nD28dOSseVL-1A=s60",
    "Mobile Guardian": "https://cdn6.aptoide.com/imgs/2/0/b/20b0b1bbb71f1d10cedd4b7cf3f58504_icon.png",
    "NetSupport School Student": "https://lh3.googleusercontent.com/EzJk8yNQKE8w-M_ObatrKLBCvOVV3AuCJ-nqmtX42XoetWTMcVyoGwhD8p2BTFfxrruSfGNG252Zm_FNfghYSrQY=s60",
    "classroom.cloud Student": "https://lh3.googleusercontent.com/A1CVYeiOYHP-CpX-xscNnOYaD68bTDsBvSp41gHY6u-RMyvtOAoIQkSe4nYrl1ESAXLQl-MHiTPwDRwbER72mSIe=s60",
    "Lockdown Browser": "https://lh3.googleusercontent.com/PZlDn-IL8L8GbNpKRtoNy1kqrrrGntCoJVt-FgnTA9uyzw0nxutkwUGjl4QoawPuNTai9S1pKNhi7uakRNy6ABU9DQ=s60",
    "Linewize Filter": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAACeNJREFUeJzt2T2LpeUBx+F7Zs7ubEYXdZBNlqAQScAUkiCIfgMh+Q7pU6bVKk221NrKPm2KVHZCICAIWwyEhJFEQVD3ZWbfPGf32LqRReVwvHd+Xld5V394nnN+cD876/V6PQCAM2139gAAYHOL/z84PlmNj05XM7YAAN/B4f7ueOnw/ENn3wj6u/86HX/+4PoPNgoA+H5+/9xPxt9e/+lDZ67cASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgQNABIEDQASBA0AEgYDF7ANvxzPnd8eql/dkzNnLn/nocXV+OT+/cnz1lq35zeH5cPtibPWMjJ8v1eP/Tu7NnbNWTi53x8rP742CxM3vKRo5uLMfxyWr2DLZA0KN+cXEx3nrtcPaMjXx8azWufHgjH/Q//OqJ8bvnDmbP2MjR9WU+6JcPFuPN3z41nn/ybP9tXvnwxjg+OZ09gy04228mj3Rwbne8+PS52TM2cmFvZ1w81/8q9PMnFmf+Wd17sJ49Yev293bGCxcX45dPne1ndbjf/039WHmyABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAELCYPQB+7N775O44Xa5nz9jIf2+tZk/Yumv3Hoy/Ht8ely7szZ6ykatffDl7Alsi6DDZO0cn452jk9kz+BYf316NN/55bfYMeCRX7gAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAELCYPQAe5cLezvj10+fGZ/cuzJ4CGf+5uRyf3L4/ewZbIOg8tn52sDf+8sozs2dAyp/+8cV4++rN2TPYAlfuABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQsJg9gO24u1qP45PV7BnAY+bmcj17Alsi6FH/vrkcf3z/89kzgMfM0Y3l7AlsiaBHXfvywfj7/+7MngHAD8Q3dAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACBB0AAgQdAAIEHQACNhZr9frrx8cn6zGR6erWXsAgG9xuL87Xjo8/9DZN4IOAJw9rtwBIEDQASBA0AEgQNABIEDQASDgK1bEjp6dQWoOAAACEGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLycgeDp4bXB0az0nSW1hZ2U6OkV4aWZUb29sIDEwLjgwJz4KPHJkZjpSREYgeG1sbnM6cmRmPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjJz4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+RmFtaWx5IFpvbmU8L3BkZjpBdXRob3I+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnhtcD0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyc+CiAgPHhtcDpDcmVhdG9yVG9vbD5DYW52YTwveG1wOkNyZWF0b3JUb29sPgogPC9yZGY6RGVzY3JpcHRpb24+CjwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9J3InPz7YOZ3FAAAAAElFTkSuQmCC",
    "Borderless Classroom Student": "https://assets.clever.com/resource-icons/apps/616de396ec2f3b00019860b9/icon_8b89c49.png",
    "LockDown Browser AP Classroom Edition": "https://lh3.googleusercontent.com/U0DwVZnvDDmgAinf5wvG9hUWcgTztx7zzjXxGvk2ZtOa7UW0b1qbXPviQq3IulEHStXdyG4DzUAOJmDjvZ5Yy5cplA=s60",
    "Lugus School": "https://lh3.googleusercontent.com/PCr-nq_15hjDNjuA5g9atstvXfJn4epdt56rtrcVi4VEVZbna-hNDOV1sHzTGi64cScpweDnmFVRI7S2ZagyYWGLB4k=s60",
};

async function createExtensionButtons() {
    let hasSupportedExtensions = false;

    for (const [name, url] of Object.entries(extensions)) {
        const success = await TryAddExtension(name, icons[name], url);
        if (success) hasSupportedExtensions = true;
    }

    if (!hasSupportedExtensions) {
        extContainer.innerHTML = "<p style='margin-left: 15px; font-size: 12px;'>Your school is not supported.</p>";
    }
}

const iframeCountEl = document.querySelector("#iframe-count")
iframeCountEl.addEventListener("input", () => {
    document.querySelector("#iframe-count-display").textContent = iframeCountEl.value
})

function createIframesAndPrint(extPage, extIcon) {
    let printerWindow = window.open("", "_blank");
    printerWindow.document.title = 'THE BYPASS';
    printerWindow.document.body.style.backgroundColor = '#1e1f22';

    let icon = printerWindow.document.createElement('link');
    icon.rel = 'icon';
    icon.href = extIcon;
    icon.type = 'image/x-icon';
    printerWindow.document.head.appendChild(icon);

    let printerBody = printerWindow.document.body;

    let loadingContainer = printerWindow.document.createElement("div");
    loadingContainer.style.position = "fixed";
    loadingContainer.style.top = "50%";
    loadingContainer.style.left = "50%";
    loadingContainer.style.transform = "translate(-50%, -50%)";
    loadingContainer.style.color = "white";
    loadingContainer.style.fontSize = "20px";
    loadingContainer.style.fontFamily = "'Roboto', sans-serif";
    loadingContainer.style.textAlign = "center";

    let spinner = printerWindow.document.createElement("div");
    spinner.style.border = "4px solid rgba(255, 255, 255, 0.3)";
    spinner.style.borderTop = "4px solid white";
    spinner.style.borderRadius = "50%";
    spinner.style.width = "40px";
    spinner.style.height = "40px";
    spinner.style.animation = "spin 1s linear infinite";
    spinner.style.margin = "0 auto 10px";

    let loadingText = printerWindow.document.createElement("div");
    loadingText.innerText = "Loading...";

    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(loadingText);
    printerBody.appendChild(loadingContainer);

    let style = printerWindow.document.createElement("style");
    style.innerHTML = `
    @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    let script = printerWindow.document.createElement("script");
    script.innerHTML = `
        setTimeout(() => {
            window.close();
        }, 5000);
    `;
    printerWindow.document.head.appendChild(style);
    printerWindow.document.body.appendChild(script);

    setTimeout(() => {
        for (let i = 0; i < iframeCountEl.value; i++) {
            const iframe = document.createElement('iframe');
            iframe.src = extPage;
            iframe.width = "25px";
            iframe.height = "25px";
            iframe.style.border = "none";
            printerBody.appendChild(iframe);
        }

        loadingContainer.remove();
        printerWindow.print();
        let iframes = printerWindow.document.querySelectorAll("iframe");
        iframes.forEach(iframe => iframe.remove());
    }, 500);
}

createExtensionButtons();

function createPopup(extName, extIcon, extPage, extId) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0, 0, 0, 0.6)";
    overlay.style.zIndex = "999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    const popup = document.createElement("div");
    popup.style.background = "#292a2d";
    popup.style.color = "white";
    popup.style.width = "500px";
    popup.style.borderRadius = "10px";
    popup.style.overflow = "hidden";
    popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
    popup.style.transition = "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.background = "#1e1f22";
    header.style.padding = "10px";
    header.style.borderBottom = "1px solid #444";

    const icon = document.createElement("img");
    icon.src = extIcon || "https://raw.githubusercontent.com/Blobby-Boi/XD-bypass/refs/heads/main/extension.png";
    icon.onerror = function() {
        this.src = "https://raw.githubusercontent.com/Blobby-Boi/XD-bypass/refs/heads/main/extension.png";
    };
    icon.style.width = "32px";
    icon.style.height = "32px";
    icon.style.marginLeft = "10px";
    icon.style.marginRight = "8px";
    icon.style.marginBottom = "5px";
    icon.style.marginTop = "5px";
    icon.style.userSelect = "none";

    const title = document.createElement("span");
    title.textContent = extName;
    title.style.userSelect = "none";

    const leftSection = document.createElement("div");
    leftSection.style.display = "flex";
    leftSection.style.alignItems = "center";
    leftSection.appendChild(icon);
    leftSection.appendChild(title);

    const x = document.createElement("span");
    x.textContent = "×";
    x.style.background = "transparent";
    x.style.color = "#9aa0a6";
    x.style.fontSize = "24px";
    x.style.marginRight = "-4px";
    x.style.marginTop = "-22px";
    x.style.cursor = "pointer";
    x.style.userSelect = "none";
    x.style.borderRadius = "50%";
    x.style.padding = "0";
    x.style.width = "32px";
    x.style.height = "32px";
    x.style.lineHeight = "32px";
    x.style.textAlign = "center";
    x.style.display = "inline-block";

    x.onmouseover = () => {
        x.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    };

    x.onmouseout = () => {
        x.style.backgroundColor = "transparent";
    };

    x.onclick = () => document.body.removeChild(overlay);

    header.appendChild(leftSection);
    header.appendChild(x);

    const instructions = document.createElement("p");
    const settingsUrl = "chrome://extensions?id=" + extId;
    instructions.innerHTML = "Open the following URL in a new tab:<br><br><span>" + settingsUrl + "</span><br><br> Then go back to this one and press the button below which will open a new tab. Immediately press ctrl+tab and start spamming the switch called \"Allow Access to file URLs\" for about 5 seconds. Once you are done, close that tab and switch to the other one. Then, press cancel on the print dialog and the tab should close. If done correctly, the extension " + extName + " should've been killed.";
    instructions.style.padding = "15px";
    instructions.style.textAlign = "center";

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.padding = "10px";

    const printButton = document.createElement("button");
    printButton.textContent = "TEMP KILL";
    printButton.style.width = "100px";
    printButton.style.marginTop = "-15px";
    printButton.style.marginBottom = "15px";
    printButton.onclick = () => {
        createIframesAndPrint(extPage, extIcon);
        instructions.innerHTML = extName + ' has been killed!';
        popup.removeChild(buttonContainer);
    };

    buttonContainer.appendChild(printButton);

    overlay.onclick = (event) => {
        if (event.target === overlay) {
            popup.style.transform = "scale(1.03)";
            setTimeout(() => {
                popup.style.transform = "scale(1)";
            }, 200);
        }
    };

    popup.appendChild(header);
    popup.appendChild(instructions);
    popup.appendChild(buttonContainer);

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

async function GetContributorData() {
    let contributors = await (await fetch("https://api.github.com/repos/Blobby-Boi/XD-bypass/contributors")).json()
    return contributors
}
const contributorList = document.querySelector("#contributor-list")
async function DisplayContributors() {
    let contributors = await GetContributorData()

    for (let contributor of contributors) {
        console.log(contributor.avatar_url, contributor.html_url, contributor.login)
        let a = document.createElement("a")
        a.href = contributor.html_url
        a.classList.add("contributor")

        let img = document.createElement("img")
        img.src = contributor.avatar_url
        a.appendChild(img)

        contributorList.appendChild(a)
    }

    document.querySelector("#contributor-content").style.display = "block"
}
DisplayContributors()

document.getElementById("main-content").style.display = "block";

// Anti Crack
const crackedCanvas = document.getElementById('CrackedCanvas');
const crackedCtx = crackedCanvas.getContext('2d');

crackedCanvas.width = window.innerWidth;
crackedCanvas.height = window.innerHeight;

crackedCtx.fillStyle = 'black';
crackedCtx.fillRect(0, 0, crackedCanvas.width, crackedCanvas.height);

crackedCtx.fillStyle = 'white';
crackedCtx.font = '48px Arial';
crackedCtx.textAlign = 'center';
crackedCtx.textBaseline = 'middle';

crackedCtx.fillText('Stop tryina crack my shit', crackedCanvas.width / 2, crackedCanvas.height / 2);
