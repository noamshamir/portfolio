let showing_coins = false;
let user_coins = 0;

window.onload = function () {
    console.log("Stored coins:", localStorage.getItem("user_coins"));
    if (localStorage.getItem("user_coins") != null) {
        user_coins = Number(localStorage.getItem("user_coins"));
        console.log(`Got user coins. new coins: ${user_coins}`);
    } else {
        user_coins = 20;
        console.log(`Didn't get user coins. new coins: ${user_coins}`);
    }
    document.getElementById("coin-count").innerText = `$${user_coins}`;
    visualizeCoins();
    for (id of [
        "chopsticks-description",
        "google-chain-translate-description",
        "por-description",
        "unit-conversion-description",
        "enigma-description",
        "job-description",
    ]) {
        unblurOnload(id);
    }
};

function unblurOnload(id) {
    const content = document.getElementById(id);
    const button = content.nextElementSibling;
    if (localStorage.getItem(id) != null) {
        document.getElementById(id).style.filter = "blur(0px)";
        button.innerHTML = "";
    } else {
        document.getElementById(id).style.filter = "blur(2px)";
    }
}

function modifyCoins(change) {
    if (user_coins + change >= 0) {
        user_coins += change;
        document.getElementById("coin-count").innerText = `$${user_coins}`;
        visualizeCoins();
        localStorage.setItem("user_coins", user_coins);
        console.log(`+${change}`);
    }
}

function purchase(cost) {
    if (user_coins >= cost) {
        modifyCoins(-cost);
    } else {
        showModal();
    }
}

function unblurContent(id, cost) {
    const content = document.getElementById(id);
    const button = content.nextElementSibling;
    if (user_coins >= cost) {
        content.style.filter = "blur(0px)";
        button.innerHTML = "";
        purchase(cost);
        localStorage.setItem(id, "unlocked");
    } else {
        showModal();
    }
}

function getCoinBreakdown() {
    let current_coins = user_coins;
    let thousands = Math.floor(current_coins / 1000);
    current_coins -= thousands * 1000;
    let five_hundreds = Math.floor(current_coins / 500);
    current_coins -= five_hundreds * 500;
    let hundreds = Math.floor(current_coins / 100);
    current_coins -= hundreds * 100;
    let twenties = Math.floor(current_coins / 20);
    current_coins -= twenties * 20;
    let fives = Math.floor(current_coins / 5);
    current_coins -= fives * 5;
    let ones = current_coins;
    return { thousands, five_hundreds, hundreds, twenties, fives, ones };
}

function addCoins(denomination, count, image_source) {
    const visualizeContainer = document.getElementById("visualize-coins");
    const container = document.createElement("div");
    container.className = "coin-column";
    for (let i = 0; i < count; i++) {
        const img = document.createElement("img");
        img.src = image_source;
        img.alt = `${denomination} coin`;
        img.className = "coin-image";
        container.appendChild(img);
    }
    visualizeContainer.appendChild(container);
}

function visualizeCoins() {
    const { thousands, five_hundreds, hundreds, twenties, fives, ones } =
        getCoinBreakdown();
    const visualizeContainer = document.getElementById("visualize-coins");
    visualizeContainer.innerHTML = "";

    addCoins("thousand", thousands, "images/coins/1000.png");
    addCoins("five_hundred", five_hundreds, "images/coins/500.png");
    addCoins("hundred", hundreds, "images/coins/100.png");
    addCoins("twenty", twenties, "images/coins/20.png");
    addCoins("fives", fives, "images/coins/5.png");
    addCoins("one", ones, "images/coins/1.png");
}

let colorPicker;
const defaultColor = "#141414";

window.addEventListener("load", startup, false);

function startup() {
    colorPicker = document.querySelector("#color-selector");
    colorPicker.value = defaultColor;
}

function changeColor() {
    let cost = 100;
    if (user_coins >= cost) {
        const gridItems = document.getElementsByClassName("grid-item");
        for (let item of gridItems) {
            item.style.backgroundColor = colorPicker.value;
        }
        purchase(100);
        getRgbFromHex();
    } else {
        showModal();
    }
}

const baseSixteen = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
];

function getRgbFromHex() {
    hex = colorPicker.value;
    console.log(`HEX: ${hex}`);
    for (let i = 1; i < 7; i++) {
        if (!baseSixteen.includes(hex[i])) {
            console.log("Invalid hex");
            break;
        }
    }

    let red = baseSixteen.indexOf(hex[1]) * 16 + baseSixteen.indexOf(hex[2]);
    let green = baseSixteen.indexOf(hex[3]) * 16 + baseSixteen.indexOf(hex[4]);
    let blue = baseSixteen.indexOf(hex[5]) * 16 + baseSixteen.indexOf(hex[6]);

    let rgb = `(${red}, ${green}, ${blue})`;
    console.log(`RGB: ${rgb}`);

    let greyscale_amount = Number(red) + Number(green) + Number(blue);

    document.getElementById("grid-container").style.backgroundColor = `(${
        Number(red) + 30
    }, ${Number(green) + 30}, ${Number(blue) + 30})`;

    let whiteTextElements = document.querySelectorAll(
        ".tab, .hi, .myname, .icon, .tab-header, .card-title, .pill, .pill-text, .card-description, .job-title, #job-dates, #color-seletor-title, #purchase-background"
    );

    let greyTextElements = document.querySelectorAll(
        ".role, .interest, .location, .company-name, #color-selector-description"
    );

    if (greyscale_amount > 300) {
        for (let i = 0; i < whiteTextElements.length; i++) {
            whiteTextElements[i].style.color = "black";
        }
        for (let i = 0; i < greyTextElements.length; i++) {
            greyTextElements[i].style.color = "rgba(0, 0, 0, 0.4)";
        }
    } else {
        for (let i = 0; i < whiteTextElements.length; i++) {
            whiteTextElements[i].style.color = "white";
        }
        for (let i = 0; i < greyTextElements.length; i++) {
            greyTextElements[i].style.color = "rgba(255, 255, 255, 0.7)";
        }
    }
}

function showModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

const gridContainer = document.getElementById("grid-container");

function populateGrid() {
    const gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = "";

    const width = window.innerWidth;
    const height = window.innerHeight;

    const cellSize = 100;
    const columns = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const totalCells = columns * rows;

    for (let i = 0; i < totalCells; i++) {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        gridContainer.appendChild(gridItem);

        gridItem.addEventListener("click", () => {
            if (gridItem.classList.contains("clicked")) {
                gridItem.classList.remove("clicked");
                gridItem.style.transition = "none";

                setTimeout(() => {
                    gridItem.style.backgroundColor = "#18181a";

                    gridItem.style.transition =
                        "background-color 0.3s ease, transform 0.3s ease";
                }, 50);
            } else {
                gridItem.classList.add("clicked");

                gridItem.style.backgroundColor = "#262528";
            }
        });
    }
}

populateGrid();
window.addEventListener("resize", populateGrid);

document.addEventListener("DOMContentLoaded", () => {
    const waveHand = document.getElementById("wave-hand");

    waveHand.addEventListener("mouseenter", () => {
        waveHand.style.animation = "none";
        void waveHand.offsetWidth;
        waveHand.style.animation = "wave-animation 0.6s ease-in-out";
    });

    // Optional: Reset animation style after it completes
    waveHand.addEventListener("animationend", () => {
        waveHand.style.animation = "none";
    });
});
