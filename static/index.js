let masterList = [];

var map;

async function getJson() {
    const data = await fetch('../static/data.json')
        .then((response) => response.json());
    return data;
}

//Gets the data from the flask server
function fetchLocationData() {
    return getJson();
}

async function initMap() {

    const myLatLng = {lat: 47.66644648737193, lng: -117.40206440541684};

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: myLatLng,
    });

    const data = await fetchLocationData(location);

    createMarkersPerLocation(map, data);
}

//Sets the location header data given a header and location denoting an location entry in data
function setLocationHeader(header, location) {

    const children = header.children;
    children[0].innerHTML = location.Facility;
    children[1].innerHTML = "Address: " + location.Address;
    children[2].innerHTML = "Inspections Done: " + location.Inspections.length;

}

function createInspecHeader(location){
        const inspecHeader = document.createElement("div");
        inspecHeader.classList.add("inspec-header");

        //Date of Inspection is Added
        const dateElement = document.createElement("p");
        dateElement.classList.add("date");
        dateElement.classList.add("inspec-header-element");

        dateElement.innerHTML = location.Date.replace(" ", "");;

        //Type
        const typeElement = document.createElement("p");
        typeElement.classList.add("type");
        typeElement.classList.add("inspec-header-element");

        typeElement.innerHTML = location.Type;

        inspecHeader.append(typeElement, dateElement);

        return inspecHeader;
}

function setRiskFactor(violationElement){

    const codeElement = violationElement.children[0];
    const msgElement = violationElement.children[1];

    if (Number(codeElement.innerHTML <= 27)) {
        codeElement.classList.add("high-risk");
        msgElement.classList.add("high-risk");

    } else {
        codeElement.classList.add("low-risk");
        msgElement.classList.add("low-risk");
    }

}

function createViolation(violationData){

                const violation = document.createElement("div");
                violation.classList.add("violation");

                const codeElement = document.createElement("p");
                codeElement.classList.add("viol-code");
                codeElement.innerHTML = violationData.Code;

                const violationElement = document.createElement("p");
                violationElement.classList.add("viol-message");
                violationElement.innerHTML = violationData.Violation;

                violation.append(codeElement, violationElement);
                setRiskFactor(violation);

                return violation;
}

function createInspecBody(location){
        const inspecBody = document.createElement("div");
        inspecBody.classList.add("inspec-body");

        //Violations of Inspection is Added
        const violations = location.Violations;

        let violation = document.createElement("div");

        if (violations.length === 0) {
            const noViolationsMsg = document.createElement("p");
            noViolationsMsg.classList.add("none");
            noViolationsMsg.innerHTML = "NO VIOLATIONS FOUND";

            violation.append(noViolationsMsg);
            inspecBody.append(violation);

        } else {
            for (let j = 0; j < violations.length; j++) {

                violation = createViolation(violations[j]);
                inspecBody.append(violation);

            }
        }
        return inspecBody;

}

function displayDetails(locData) {
    const locContainer = document.getElementById("loc-container");
    const locHeader = locContainer.children[0];
    const locDetails = locContainer.children[1];


    setLocationHeader(locHeader, locData);

    let inspectionsData = locData.Inspections;

    const inspectionContainer = document.createElement("div");
    inspectionContainer.classList.add("inspection-container");

    for (let i = 0; i < inspectionsData.length; i++) {
        const inspection = document.createElement("div");
        inspection.classList.add("inspection");

        const inspecHeader = createInspecHeader(inspectionsData[i]);
        const inspecBody = createInspecBody(inspectionsData[i]);

        inspection.append(inspecHeader,inspecBody);
        inspectionContainer.append(inspection);

        inspecHeader.addEventListener("click", () => {
            if (inspecBody.style.display === "none") {
                inspecBody.style.display = "block";
            } else {
                inspecBody.style.display = "none";
            }
        });

    }

    locDetails.append(inspectionContainer);
}

function searchLocations() {
    const searchForm = document.getElementById("search-form");

    const srchFormChildren = searchForm.children;

    console.log(srchFormChildren[1].value);
    const userInput = srchFormChildren[1].value.toLowerCase();

    for (var marker of masterList) {
        console.log(marker.Marker)
        const title = marker.Title.toLowerCase();
        if (!title.includes(userInput)) {
            marker.Marker.setVisible(false);
        } else {
            marker.Marker.setVisible(true);

        }
    }
    map.setZoom(11);

}

function createMarkersPerLocation(map, locationData) {
    const dataPointSize = Object.keys(locationData).length;
    for (let i = 0; i < dataPointSize; i++) {
        createMarker(map, locationData[i]);
    }
}

function setMarkerListeners(map, infowindow, marker) {
    marker.addListener("mouseover", () => {
        infowindow.open({
            anchor: marker,
            map,
        });
    });
    marker.addListener("click", () => {
        map.setZoom(18),
            map.setCenter(marker.position);
    });
    marker.addListener("mouseout", () => {
        infowindow.close();
    });
}

function getLocationInfoWindow(location) {
    return `<b><div class="click-me">${location.Facility}</div></b>` +
        `<br>Address: ${location.Address}`
        + `<br>Inspections Done: ${location.Inspections.length} `;

}

function createMarker(map, location) {
    const marker = new google.maps.Marker({
        position: {lat: location.Latitude, lng: location.Longitude},
        map,
        title: location.Facility,
    });
    const markerData = {"Marker": marker, "Title": location.Facility}
    masterList.push(markerData);

    const infoPerLocation = getLocationInfoWindow(location);

    const infowindow = new google.maps.InfoWindow({
        content: infoPerLocation,
        ariaLabel: location.name,
    });

    marker.addListener("click", () => {
        const inspecElement = document.getElementsByClassName("inspection-container");

        if (inspecElement === null) {
            console.log("element does not exist");
        } else {
            for (var inspecE of inspecElement) {
                inspecE.remove();
            }
        }

        displayDetails(location);
    });


    setMarkerListeners(map, infowindow, marker);
}

window.initMap = initMap;
  