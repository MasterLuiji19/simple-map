const elSelectedCity = document.querySelector(".selected-region__current-city");
const elCityList = document.querySelector(".selected-region__list");
const elStoreList = document.querySelector(".store-list");

let cityData = [];
let curStoreList = [];

elSelectedCity.addEventListener("click", toggleCityList);


function toggleCityList() {
    elSelectedCity.classList.toggle("active");
    elCityList.classList.toggle("active");
}

function loadData() {
    fetch("./data/store-list.json")
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            cityData = data;
            viewCityData(data);
        })
        .catch((err) => {
            console.log(err);
        });
}

function viewCityData(data) {
    for (const city in data) {
        if (Object.hasOwnProperty.call(data, city)) {
            const curCity = data[city];

            let elCity = document.createElement("div");
            elCity.classList.add("selected-region__city");
            elCity.dataset.cityId = curCity.city_id;
            elCity.addEventListener("click", clickOnCityRegion);

            let elCityName = document.createElement("h4");
            elCityName.classList.add("selected-region__city-name");
            elCityName.innerHTML = curCity.city_name;
            elCity.appendChild(elCityName);

            let elCityRegion = document.createElement("p");
            elCityRegion.classList.add("selected-region__city-region");
            elCityRegion.innerHTML = curCity.city_region;
            elCity.appendChild(elCityRegion);

            elCityList.appendChild(elCity);
        }
    }
}

function clickOnCityRegion(e) {
    let curCityId = e.target.closest(".selected-region__city").dataset.cityId;
    console.log("Click on city ", curCityId);

    const curDataRegion = cityData.filter(c => c.city_id === curCityId)[0];
    curStoreList = curDataRegion;
    console.log(curDataRegion);

    elSelectedCity.innerHTML = "";
    let elCurStore = document.createElement("div");
    elCurStore.classList.add("selected-region__city");
    let elCurStoreName = document.createElement("h4");
    elCurStoreName.classList.add("selected-region__city-name");
    elCurStoreName.innerHTML = curDataRegion.city_name;
    elCurStore.appendChild(elCurStoreName);
    let elCurStoreRegion = document.createElement("p");
    elCurStoreRegion.classList.add("selected-region__city-region");
    elCurStoreRegion.innerHTML = curDataRegion.city_region;
    elCurStore.appendChild(elCurStoreRegion);
    elSelectedCity.appendChild(elCurStore);

    elStoreList.innerHTML = "";
    for (const item of curDataRegion.city_stores) {
        let elStore = document.createElement("div");
        elStore.classList.add("store");
        elStore.dataset.storeId = item.id;
        elStore.addEventListener("click", viewSelectedStore);

        let elStorePlace = document.createElement("h4");
        elStorePlace.classList.add("store-place");
        elStorePlace.innerHTML = item.address_name;
        elStore.appendChild(elStorePlace);

        let elStoreAddress = document.createElement("p");
        elStoreAddress.classList.add("store-address");
        elStoreAddress.innerHTML = item.address_details;
        elStore.appendChild(elStoreAddress);

        if (item.phone !== undefined && item.phone !== "") {
            let elStoreTel = document.createElement("p");
            elStoreTel.classList.add("store-tel");

            let elStoreTelLink = document.createElement("a");
            elStoreTelLink.classList.add("store-tel-link");
            elStoreTelLink.href = "tel:" + item.phone;
            elStoreTelLink.innerHTML = item.phone;
            elStoreTel.appendChild(elStoreTelLink);
            elStore.appendChild(elStoreTel);
        }

        if (item.is_self_taking) {
            let elStorPickup = document.createElement("p");
            elStorPickup.classList.add("store-pickup");
            elStorPickup.innerHTML = "Pickup is available";
            elStore.appendChild(elStorPickup);
        }

        if (item.work_time !== undefined && item.work_time.length > 0) {
            let elStoreShedule = document.createElement("div");
            elStoreShedule.classList.add("store-shedule");

            for (const sheduleItemData of item.work_time) {
                let elStoreSheduleItem = document.createElement("p");
                elStoreSheduleItem.classList.add("store-shedule-time");
                elStoreSheduleItem.innerHTML = sheduleItemData.work_time;
                elStoreShedule.appendChild(elStoreSheduleItem);
            }

            elStore.appendChild(elStoreShedule);
        }

        elStoreList.appendChild(elStore);
    }
    toggleCityList();
}

function viewSelectedStore(e) {
    const curStoreId = e.target.closest(".store").dataset.storeId;
    console.log("click on store", curStoreId);
    const curStore = curStoreList.city_stores.filter(s => s.id == curStoreId)[0];
    console.log(curStore);
}

loadData();