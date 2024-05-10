function fetchSvgSprite() {
    const iconUrl = "./solar-icon.svg";
    return fetch(iconUrl)
    .then((response) => response.text())
    .then((svgText) => {
        const svgContainer = document.querySelector(".solar-svg");
        svgContainer.insertAdjacentHTML("beforeend", svgText);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchSvgSprite().then(() => {
        generateIconList();
        addIconClickListener();
        handleSearchForm();
        handleQuickGroup();
        handleQuickBtn();
    })
});


function generateIconList() {
    const groups = document.querySelectorAll("symbol");
    const iconContainer = document.querySelector(".icon-container");

    groups.forEach((group) => {
        const iconTitle = group.getAttribute("id");
        const displayedIconTitle = iconTitle.replace("solar-", "").replace("-linear", "").replace("-bold", "");
        const parentGroup = group.parentElement.getAttribute("id");

        let groupContainer = iconContainer.querySelector(`.icon-group-${parentGroup}`);
        if (!groupContainer) {
            groupContainer = createIconGroupContainer(parentGroup);
            iconContainer.appendChild(groupContainer);
        }

        const iconWrap = createIconItem(iconTitle, displayedIconTitle);
        groupContainer.appendChild(iconWrap);
    });
}

function createIconGroupContainer(parentGroup) {
    const groupContainer = document.createElement("div");
    groupContainer.classList.add(`icon-group-${parentGroup}`);

    const groupTitle = document.createElement("div");
    groupTitle.classList.add("group-title");
    groupTitle.textContent = parentGroup;

    groupContainer.appendChild(groupTitle);
    return groupContainer;
}

function createIconItem(iconTitle, displayedIconTitle) {
    const iconWrap = createIconBtn();
    const itemTitle = createItemTitleSpan(iconTitle, displayedIconTitle);
    const newSvg = createSvgElement(iconTitle);

    iconWrap.appendChild(newSvg);
    iconWrap.appendChild(itemTitle);

    return iconWrap;
}

function createIconBtn() {
    const button = document.createElement("button");
    button.classList.add("icon-item");
    return button;
}

function createItemTitleSpan(iconTitle, displayedText) {
    const span = document.createElement("span");
    span.classList.add("item-title", iconTitle);
    span.textContent = displayedText;
    return span;
}

function createSvgElement(iconTitle) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("solar-icon");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${iconTitle}`);
    svg.appendChild(use);
    return svg;
}

function showPopUp(iconName) {
    const popUpWrap = createPopUpWrap(iconName);
    document.body.appendChild(popUpWrap);
    hljs.highlightAll();
    popUpWrap.style.display = "flex";

    popUpWrap.addEventListener("click", (e) => {
        if (e.target === popUpWrap) {
            document.body.removeChild(popUpWrap);
        }
    });
}

function createPopUpWrap(iconName) {
    const popUpWrap = createDivClass("pop-up-wrap");
    const popUp = createDivClass("pop-up");
    const popUpInner = createDivClass("pop-up-inner");
    const popUpTitle = createDivText("pop-up-title", iconName);
    const popUpMarkup = createPopUpMarkup(iconName);
    const popUpIcon = createPopUpIcon(iconName);

    assemblePopUp(popUp, popUpInner, popUpIcon, popUpTitle, popUpMarkup);
    popUpWrap.appendChild(popUp);

    addCopyBtn(popUpTitle);
    addCopyBtn(popUpMarkup);

    return popUpWrap;
}

function createDivClass(className) {
    const div = document.createElement("div");
    div.classList.add(className);
    return div;
}

function createDivText(className, text) {
    const div = createDivClass(className);
    div.textContent = text;
    return div;
}

function createPopUpMarkup(iconName) {
    const markup = createDivClass("pop-up-markup");
    const svgMarkup = `<pre><code>&lt;svg class="solar-icon" width="24" height="24" viewBox="0 0 24 24"&gt;&lt;use href="#${iconName}"&gt;&lt;/use&gt;&lt;/svg&gt;</code></pre>`;
    markup.insertAdjacentHTML("beforeend", svgMarkup);
    return markup;
}

function createPopUpIcon(iconName) {
    const iconDiv = createDivClass("pop-up-icon");
    const svgIcon = `<svg class="solar-icon" width="24" height="24" viewBox="0 0 24 24"><use href="#${iconName}"></use></svg>`;
    iconDiv.insertAdjacentHTML("beforeend", svgIcon);
    return iconDiv;
}

function assemblePopUp(popUp, popUpInner, popUpIcon, popUpTitle, popUpMarkup) {
    popUp.appendChild(popUpIcon);
    popUp.appendChild(popUpInner);
    popUpInner.appendChild(popUpTitle);
    popUpInner.appendChild(popUpMarkup);
}

function addIconClickListener() {
    const iconItems = document.querySelectorAll(".icon-item");
    iconItems.forEach(item => {
        item.addEventListener("click", () => {
            const titleClass = item.querySelector(".item-title").classList[1];
            showPopUp(titleClass);
        });
    });
}

function addCopyBtn(element) {
    const copyBtn = createCopyBtn();
    attachCopyFunctionality(copyBtn, element);
    element.appendChild(copyBtn);
}

function createCopyBtn() {
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.classList.add("copy-btn");
    copyBtn.insertAdjacentHTML("beforeend", `
        <svg class="solar-icon" width="24" height="24" viewBox="0 0 24 24">
            <use href="#solar-clipboard-check-linear"></use>
        </svg>`
    );
    return copyBtn;
}

function attachCopyFunctionality(copyBtn, element) {
    copyBtn.addEventListener("click", async () => {
        try {
            await copyTextToClipboard(element.textContent);
            displayCopyConfirmation(copyBtn);
        } catch (error) {
            alert("다시 시도해주세요.");
            console.error("Copy failed", error);
        }
    });
}

async function copyTextToClipboard(text) {
    const trimmedText = text.trim();
    await navigator.clipboard.writeText(trimmedText);
}

function displayCopyConfirmation(copyBtn) {
    copyBtn.classList.add("complete");
    const copyMsg = document.createElement("span");
    copyMsg.textContent = "Copied~!";
    copyMsg.classList.add("copy-msg");
    copyBtn.appendChild(copyMsg);

    setTimeout(() => {
        copyBtn.classList.remove("complete");
        copyBtn.removeChild(copyMsg);
    }, 2000);
}

function handleSearchForm() {
    const searchBtn = document.querySelector(".search-btn");
    const searchInput = document.querySelector(".search-input");

    attachSearchListeners(searchBtn, searchInput);
}

function attachSearchListeners(searchBtn, searchInput) {
    searchBtn.addEventListener("click", executeSearch);
    searchInput.addEventListener("input", executeSearch);
}

function executeSearch() {
    const searchTerm = getSearchTerm();
    filterIconsByTerm(searchTerm);
}

function getSearchTerm() {
    const searchInput = document.querySelector(".search-input");
    return searchInput.value.toLowerCase();
}

function filterIconsByTerm(searchTerm) {
    const iconGroups = document.querySelectorAll("[class^='icon-group-']");

    iconGroups.forEach((group) => {
        filterIconsInGroup(group, searchTerm);
        toggleGroupVisibility(group);
    });
}

function filterIconsInGroup(group, searchTerm) {
    const icons = group.querySelectorAll(".icon-item");
    let hasVisibleIcons = false;

    icons.forEach((icon) => {
        const isVisible = checkIconAgainstSearchTerm(icon, searchTerm);
        icon.style.display = isVisible ? "flex" : "none";
        hasVisibleIcons = hasVisibleIcons || isVisible;
    });

    group.dataset.hasVisibleIcons = hasVisibleIcons;
}

function toggleGroupVisibility(group) {
    const hasVisibleIcons = group.dataset.hasVisibleIcons === "true";
    group.style.display = hasVisibleIcons ? "grid" : "none";
}

function checkIconAgainstSearchTerm(icon, searchTerm) {
    const title = icon.querySelector(".item-title").textContent.toLowerCase();
    const groupTitle = icon.closest("[class^='icon-group-']").querySelector(".group-title").textContent.toLowerCase();
    return title.includes(searchTerm) || groupTitle.includes(searchTerm);
}

function handleQuickGroup() {
    const quickListBtns = document.querySelectorAll(".quick-list button");

    quickListBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const targetGroupClass = e.target.classList[0];
            const targetGroup = document.querySelector(`div.${targetGroupClass}`);

            if (targetGroup) {
                targetGroup.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });
}

function handleQuickBtn() {
    const quickBtn = document.querySelector(".quick-btn");
    const quickList = document.querySelector(".quick-list");
    quickBtn.addEventListener("click", (e) => {
        if (quickList.classList.contains("open")) {
            quickList.classList.remove("open");
            quickList.style.visivility = "hidden";
            quickList.style.opacity = "0";
        } else {
            quickList.classList.add("open");
            quickList.style.visivility = "visible";
            quickList.style.opacity = "1";
        }
    });
}