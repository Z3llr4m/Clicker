
<!-- ===================== -->
<!-- 🍪 ПЕЧЕНЬКА -->
<!-- ===================== -->
<img id="cookie" src="https://i.imgur.com/hb7mM2A.png" alt="Cookie">

<!-- ===================== -->
<!-- 🏠 ЗДАНИЯ -->
<!-- ===================== -->
<div id="buildings"></div>

<!-- ===================== -->
<!-- 🔼 АПГРЕЙДЫ -->
<!-- ===================== -->
<div id="upgrades"></div>

<!-- ===================== -->
<!-- 🌟 ПРЕСТИЖ -->
<!-- ===================== -->
<button id="prestigeButton">Сделать престиж</button>

<!-- ===================== -->
<!-- 📊 СТАТИСТИКА -->
<!-- ===================== -->
<div id="stats" class="stats-window">
    <p id="totalTime">Время в игре: 00:00:00</p>
    <p id="totalCookies">Всего печенек: 0</p>
    <p id="golden">Золотые печеньки: 0</p>
    <p id="prestiges">Престижей сделано: 0</p>
    <p id="clicks">Всего кликов: 0</p>
    <p id="cps">CPS: 0</p>
</div>

<script src="game.js"></script>
</body>
</html>
// =====================
// 🍪 ПЕРЕМЕННЫЕ И НАСТРОЙКИ
// =====================
let cookies = 0;
let totalCookiesEarned = 0;
let cps = 0;
let clicks = 0;
let goldenCookies = 0;
let prestigeCount = 0;
let startTime = Date.now();

const buildings = [
    {name:"Курсор", emoji:"🖱️", baseCost:15, cps:0.1, count:0},
    {name:"Бабушка", emoji:"👵", baseCost:100, cps:1, count:0},
    {name:"Ферма", emoji:"🌾", baseCost:1100, cps:8, count:0},
    {name:"Шахта", emoji:"⛏️", baseCost:12000, cps:47, count:0},
    {name:"Фабрика", emoji:"🏭", baseCost:130000, cps:260, count:0},
    {name:"Банк", emoji:"🏦", baseCost:1400000, cps:1400, count:0},
    {name:"Храм", emoji:"⛪", baseCost:20000000, cps:7800, count:0},
    {name:"Шахта-Гигант", emoji:"🗻", baseCost:330000000, cps:44000, count:0},
    {name:"Фабрика-Мегатон", emoji:"🏢", baseCost:5100000000, cps:260000, count:0},
    {name:"Пространственный Резонатор", emoji:"🛸", baseCost:75000000000, cps:1600000, count:0},
    {name:"Многофабрика", emoji:"🏗️", baseCost:1000000000000, cps:10000000, count:0},
    {name:"Трансгалактическая корпорация", emoji:"🚀", baseCost:14000000000000, cps:65000000, count:0},
    {name:"Мегакосмос", emoji:"🌌", baseCost:170000000000000, cps:430000000, count:0},
    {name:"Вселенский завод", emoji:"🏰", baseCost:2100000000000000, cps:3000000000, count:0},
    {name:"Божественный генератор", emoji:"👑", baseCost:26000000000000000, cps:21000000000, count:0},
];

let upgrades = []; // {buildingIndex, level, cost}

// =====================
// 💾 СОХРАНЕНИЕ И ЗАГРУЗКА
// =====================
function saveGame() {
    localStorage.setItem("cookieClickerSave", JSON.stringify({
        cookies, totalCookiesEarned, cps, clicks, goldenCookies,
        prestigeCount, buildings, upgrades, startTime
    }));
}

function loadGame() {
    let save = JSON.parse(localStorage.getItem("cookieClickerSave"));
    if(save) {
        cookies = save.cookies;
        totalCookiesEarned = save.totalCookiesEarned;
        cps = save.cps;
        clicks = save.clicks;
        goldenCookies = save.goldenCookies;
        prestigeCount = save.prestigeCount;
        startTime = save.startTime || Date.now();
        save.buildings.forEach((b,i)=> buildings[i].count = b.count);
        upgrades = save.upgrades || [];
        updateCookies();
        updateCPS();
        renderBuildings();
        renderUpgrades();
    }
}

// =====================
// 🔼 ФУНКЦИИ ОБНОВЛЕНИЯ
// =====================
function updateCookies() {
    document.getElementById("totalCookies").innerText = "Всего печенек: " + Math.floor(cookies);
}

function updateCPS() {
    cps = buildings.reduce((acc,b)=> acc + b.count*b.cps,0);
    cps += goldenCookies * 0.001; // Престиж бонус
    document.getElementById("cps").innerText = "CPS: " + cps.toFixed(2);
}

function updateTime() {
    let elapsed = Date.now() - startTime;
    let h = Math.floor(elapsed/3600000);
    let m = Math.floor((elapsed%3600000)/60000);
    let s = Math.floor((elapsed%60000)/1000);
    document.getElementById("totalTime").innerText = `Время в игре: ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

// =====================
// 🍪 КЛИК ПО ПЕЧЕНЬКЕ
// =====================
document.getElementById("cookie").onclick = () => {
    clicks++;
    cookies += 1;
    totalCookiesEarned += 1;
    updateCookies();
    spawnFloatingCookie();
}

// =====================
// ✨ ВСПЛЫВАЮЩИЕ ПЕЧЕНЬКИ
// =====================
function spawnFloatingCookie() {
    let f = document.createElement("div");
    f.className = "floating-cookie";
    f.innerText = "+1";
    f.style.left = (window.innerWidth/2 + (Math.random()*40-20)) + "px";
    f.style.top = (window.innerHeight/2 + (Math.random()*40-20)) + "px";
    document.body.appendChild(f);
    setTimeout(()=> f.remove(), 1000);
}

// =====================
// 🏠 РЕНДЕР ЗДАНИЙ
// =====================
function renderBuildings() {
    let container = document.getElementById("buildings");
    container.innerHTML = "";
    buildings.forEach((b,i)=>{
        let btn = document.createElement("button");
        btn.className = "building" + (cookies>=b.baseCost ? " available":"");
        btn.innerText = `${b.emoji} ${b.name} (x${b.count}) - CPS: ${(b.cps*b.count).toFixed(2)} - ${b.baseCost} 🍪`;
        btn.onclick = () => buyBuilding(i);
        container.appendChild(btn);
    });
}

// =====================
// 🏠 ПОКУПКА ЗДАНИЯ
// =====================
function buyBuilding(index) {
    let b = buildings[index];
    let cost = b.baseCost * Math.pow(1.15,b.count);
    if(cookies >= cost) {
        cookies -= cost;
        b.count++;
        totalCookiesEarned += cost;
        updateCookies();
        updateCPS();
        renderBuildings();
        renderUpgrades();

        // Анимация кнопки
        let bBtn = document.getElementsByClassName("building")[index];
        bBtn.classList.add("upgrade-anim");
        setTimeout(()=>bBtn.classList.remove("upgrade-anim"),500);

        // Всплывающее CPS
        let rect = bBtn.getBoundingClientRect();
        spawnCPSPopup(rect.left + rect.width/2, rect.top, b.cps);
    }
}

// =====================
// 🔼 РЕНДЕР АПГРЕЙДОВ
// =====================
function renderUpgrades() {
    let container = document.getElementById("upgrades");
    container.innerHTML = "";
    buildings.forEach((b,i)=>{
        let level = upgrades[i] ? upgrades[i].level : 0;
        let cost = Math.floor(b.baseCost*10 + level*10 + Math.random()*0.5*(b.baseCost*10));
        let btn = document.createElement("button");
        btn.className = "upgrade" + (cookies>=cost ? " available":"");
        btn.innerText = `${b.emoji} ${b.name} x${level+2} - ${Math.floor(cost)} 🍪`;
        btn.onclick = () => {
            if(cookies >= cost) {
                cookies -= cost;
                b.cps *= (level+2)/(level+1);
                upgrades[i] = {buildingIndex:i, level:level+1, cost:cost};
                updateCookies();
                updateCPS();
                renderBuildings();
                renderUpgrades();
                btn.classList.add("upgrade-anim");
                setTimeout(()=>btn.classList.remove("upgrade-anim"),500);

                // Всплывающее CPS
                let rect = btn.getBoundingClientRect();
                spawnCPSPopup(rect.left + rect.width/2, rect.top, b.cps*(upgrades[i].level));
            }
        };
        container.appendChild(btn);
    });
}

// =====================
// 🌟 ПРЕСТИЖ
// =====================
document.getElementById("prestigeButton").onclick = () => {
    if(cookies >= 1e12) {
        if(confirm("Сделать престиж?\nВы получите 0.1% бонус к CPS за каждую золотую печеньку.")) {
            cookies = 0;
            buildings.forEach(b=>b.count=0);
            upgrades = [];
            goldenCookies += 1;
            prestigeCount++;
            updateCookies();
            updateCPS();
            renderBuildings();
            renderUpgrades();
        }
    } else {
        alert("Для престижа нужно накопить 1 трлн печенек!");
    }
}

// =====================
// ✨ ЛЕТЯЩИЕ ПЕЧЕНЬКИ НА ФОНЕ
// =====================
function spawnFlyingCookie() {
    let flying = document.createElement("div");
    flying.className = "flying-cookie";
    flying.innerText = "🍪";
    flying.style.left = Math.random() * window.innerWidth + "px";
    flying.style.top = window.innerHeight + "px";
    document.body.appendChild(flying);
    setTimeout(()=> flying.remove(),4000);
}
setInterval(spawnFlyingCookie,1000);

// =====================
// 💥 ВСПЛЫВАЮЩИЙ CPS
// =====================
function spawnCPSPopup(x, y, amount) {
    let f = document.createElement("div");
    f.className = "floating-cookie";
    f.innerText = `+${amount.toFixed(1)} CPS`;
    f.style.left = x + "px";
    f.style.top = y + "px";
    f.style.color = "#00ffff";
    f.style.fontWeight = "bold";
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1200);
}

// =====================
// ✨ ВЕЛИКИЕ СУММЫ - ЭФФЕКТ
// =====================
function checkBigNumbers() {
    if(cookies >= 1e9 && !document.getElementById("bigEffect")) {
        let effect = document.createElement("div");
        effect.id = "bigEffect";
        effect.style.position = "fixed";
        effect.style.top = "0";
        effect.style.left = "0";
        effect.style.width = "100%";
        effect.style.height = "100%";
        effect.style.pointerEvents = "none";
        effect.style.backgroundImage = "url('https://i.imgur.com/4O1fS7x.png')";
        effect.style.backgroundSize = "contain";
        effect.style.backgroundRepeat = "no-repeat";
        effect.style.backgroundPosition = "center";
        effect.style.opacity = "0.7";
        document.body.appendChild(effect);
        setTimeout(()=> effect.remove(), 3000);
    }
}

// =====================
// 🔁 ОБНОВЛЕНИЕ CPS И ВРЕМЕНИ
// =====================
setInterval(()=>{
    cookies += cps/10; 
    updateCookies();
    updateCPS();
    updateTime();
    checkBigNumbers();
},100);

// =====================
// 💾 ЗАГРУЗКА
// =====================
loadGame();

// =====================
// 💾 АВТОСЕЙВ
// =====================
setInterval(saveGame,5000);

// =====================
// 📦 ЭКСПОРТ / ИМПОРТ
// =====================
function exportSave() {
    let saveStr = localStorage.getItem("cookieClickerSave");
    let blob = new Blob([saveStr], {type:"text/plain"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cookiesave.txt";
    a.click();
}

function importSave(file) {
    let reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem("cookieClickerSave", e.target.result);
        loadGame();
    };
    reader.readAsText(file);
}
