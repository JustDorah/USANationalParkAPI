'use strict';

// Base  URL with endpoint /parks
const npsURL = 'https://developer.nps.gov/api/v1/parks';
//API key
const apiKey ='w2zeUfQTPXBoIT154Rrc0JmxIpdIMAbXPlbpgkIc';

function displayStateOptions(){
  let stateSelected = Object.keys(states);
  stateSelected.forEach(stateCode => {
    $('#js-search-state').append(
      `<option value="${stateCode}">${states[stateCode]}</option>`
    )    
  });  
}

function getSubmittedInfo(){
   $('form').submit(event=> {
    event.preventDefault();
    const stateSubmitted = $('#js-search-state').val(); 
    const numResults =$('#js-numEntered').val();
    //console.log(stateSubmitted,numResults, 'state number of display submitted');
  createQueryString(stateSubmitted, numResults);

  });
}

function createQueryString(stateSubmitted, numResults){
  const params = {
    api_key: apiKey,
    stateCode: stateSubmitted,
    limit: numResults,
    start: 0,
    fields: 'addresses'
  };
  const queryString = `stateCode=${stateSubmitted}&limit=${numResults}&start=0&fields=addresses&api_key=${apiKey}`
  //console.log(queryString);

findParks(queryString);
}

function findParks(queryString) {
    const url = npsURL + '?' + queryString;
    //console.log('the url is', url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => getPhysicalAddress(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
            console.log(err.message)
        });
}
function getPhysicalAddress(json) {
 console.log('getPhysicalAddress is working');
    $('#js-results-list').empty();
    json.data.forEach(element => {
        console.log(element.addresses, '!!!addresses')
        const addresses = element.addresses;
        //console.log(addresses, 'address captured!');


        const messyPhysAddress = addresses.filter(address => address.type === 'Physical')[0];
       // console.log(messyPhysAddress, 'physicalAddress!!!!!');

        //console.log(json);
        cleanPhysicalAddress(messyPhysAddress, {fullName: element.fullName, url: element.url, description: element.description});
    });
}
function cleanPhysicalAddress(messyPhysAddress, info) {
    console.log('clean is working');
    let physAddress = {};

    //remove the falsy key/values in the address object
    const removeEmptyAdress = (messyPhysAddress) => {
        const cleanPhysAddress = {};
        Object.keys(messyPhysAddress).forEach(key => {
            if (messyPhysAddress[key] && typeof messyPhysAddress[key] === 'object') removeEmptyAdress(messyPhysAddress[key]);
            else if (messyPhysAddress[key] == undefined) delete messyPhysAddress[key];
            else if (messyPhysAddress[key]) cleanPhysAddress[key] = messyPhysAddress[key];
        });
        return cleanPhysAddress;
    };
    //console.log(removeEmptyAdress(messyPhysAddress).line1, 'cleaned up ')

    physAddress = removeEmptyAdress(messyPhysAddress);
    //console.log('got it !!!!!', physAddress, 'got it !!!!!')
    
    //return physAddress;
    displayResults(physAddress, info);
}
//display results
function displayResults(physAddress, info) {
   

    $('#js-results-list').append(
        `<li>
        <h2>${info.fullName}</h2>
        <p>${info.description}<br><br>
        URL:<a href="${info.url}" target="_blank">${info.url}</a></p>
        <p>Address:<br>
        <a href="https://google.com/maps/search/${info.fullName}" target="_blank">${physAddress.line1}<br>${physAddress.line2}, ${physAddress.city}, ${physAddress.stateCode} ${physAddress.postalCode}</a></p>
        </li>`
    );
    $('#results').removeClass('hidden');
}

function searchInitiated(){
  console.log('Loaded!...');
  //show the states to be selected
  displayStateOptions();

  //listen || get the sbumitted information
  getSubmittedInfo();
}

$(searchInitiated);