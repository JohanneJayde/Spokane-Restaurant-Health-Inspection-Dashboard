
let masterList = [];

var map;

async function getJson(){
  const data = await fetch('../static/data.json')
    .then((response) => response.json());
    return data;
}

//Gets the data from the flask server
function fetchLocationData(){
    return getJson();
}

function addKeyboardClick(){

};

async function initMap() {

    const myLatLng = {lat: 47.66644648737193, lng: -117.40206440541684};

    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 11,
      center: myLatLng,
    });

    addKeyboardClick();
  
    const data = await fetchLocationData(location);

    createMarkersPerLocation(map,data);
  }

  function displayDetails(locData){
    const locDetails = document.getElementById("loc-details");

    const children = locDetails.children;
    children[0].innerHTML = locData.Facility;
    children[1].innerHTML = locData.Address;

    let inspectionsData = locData.Inspections;

    for(let i = 0; i < inspectionsData.length; i++){
      const inspectionDiv = document.createElement("div");
      inspectionDiv.classList.add("inspections");

      //Date of Inspection is Added
      const dateElement = document.createElement("p");
      dateElement.classList.add("date");
      const date = inspectionsData[i].Date.replace(" ", "");
      dateElement.innerHTML = date;

      //Type
      const typeElement = document.createElement("p");
      typeElement.classList.add("type");
      const type = inspectionsData[i].Type;
      typeElement.innerHTML = type;

      inspectionDiv.append(typeElement, dateElement);

      //Violations of Inspection is Added
      const violations = inspectionsData[i].Violations;


      if(violations.length === 0){
        const noViolationsMsg = document.createElement("p");
        noViolationsMsg.classList.add("none");
        noViolationsMsg.innerHTML = "NO VIOLATIONS FOUND";
        inspectionDiv.append(noViolationsMsg);

      }
      else{
      for(let j = 0; j < violations.length; j++ ){
  
          
          const codeElement = document.createElement("p");
          codeElement.classList.add("code");
          const code = violations[j].Code;
          codeElement.innerHTML = code;



          const violationElement = document.createElement("p");
          violationElement.classList.add("violation");
          const violationMsg = violations[j].Violation;
          violationElement.innerHTML = violationMsg;

          if(Number(code <=27)){
            codeElement.classList.add("high-risk");
            violationElement.classList.add("high-risk");

          }
          else{
            codeElement.classList.add("low-risk");
            violationElement.classList.add("low-risk");

          }

          inspectionDiv.append(codeElement, violationElement);

        }

      }


      locDetails.append(inspectionDiv);
    }


  }

  function searchLocations(){
      const searchForm = document.getElementById("search-form");

      const srchFormChildren = searchForm.children;

        console.log(srchFormChildren[1].value);
        const userInput = srchFormChildren[1].value.toLowerCase();

        for(var marker of masterList){
          console.log(marker.Marker)
          const title = marker.Title.toLowerCase();
          if(!title.includes(userInput)){
            marker.Marker.setVisible(false);
          }
          else{
            marker.Marker.setVisible(true);

          }
        }
        map.setZoom(11);



  }
    
   function createMarkersPerLocation(map,locationData){
    const dataPointSize = Object.keys(locationData).length;
    for(let i = 0; i < dataPointSize; i++){
      createMarker(map, locationData[i]);
    }
  }

  function setMarkerListeners(map, infowindow, marker){
    marker.addListener("mouseover", () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });
    marker.addListener("click", () =>{
      map.setZoom(18),
      map.setCenter(marker.position);
    });
    marker.addListener("mouseout", () => {
      infowindow.close();
    });
  }

  function getLocationInfoWindow(location){
    return `<b><div class="click-me">${location.Facility}</div></b>`+
    `<br>Address: ${location.Address}`
    + `<br>Inspections Done: ${location.Inspections.length} `;
  
  }

  function createMarker(map,location){
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

    marker.addListener("click", () =>{
      const inspecElement = document.getElementsByClassName("inspections");
    
      if(inspecElement === null){
        console.log("element does not exist");
      }
      else{
        for(var inspecE of inspecElement){
          inspecE.remove();
        }
  
      }
  
      displayDetails(location);
  });


    setMarkerListeners(map, infowindow,marker);
  }

  window.initMap = initMap;
  