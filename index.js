'use strict';
// Base  URL with endpoint /parks
const npsURL = 'https://developer.nps.gov/api/v1/parks';

//API key
const apiKey ='w2zeUfQTPXBoIT154Rrc0JmxIpdIMAbXPlbpgkIc';
function holdJsonInfofunc(jsonInfo){
    console.log(jsonInfo, 'jso info');
    let info = [];
    return info = jsonInfo;
  }

  /**Stopped here... trying to pass json infor to  diplay results */

function displayResults (physAddress, info) {
  // $('#js-status-text').text('Search results:').addClass('success-text');
  //console.log(json, 'its the resulsts!!');
  //const physAddress = cleanPhysicalAddress(messyPhysAddress);
  console.log(info, 'json in diplay!!!!')
  
  console.log(`${physAddress.line1} ${physAddress.line2}, ${physAddress.city}, ${physAddress.stateCode} ${physAddress.postalCode}`);


  $('#js-results-list').append(
    `<li>
        <h2>${physAddress.name}</h2>
        <p>${physAddress.description}</p>
        <a href="https://google.com/maps/search/${physAddress.line1}${physAddress.line2},${physAddress.city},${physAddress.stateCode}${physAddress.postalCode}" target="_blank">${physAddress.line1}<br>${physAddress.line2}, ${physAddress.city}, ${physAddress.stateCode} ${physAddress.postalCode}</a>
        <a href="${physAddress.url}" target="_blank">${physAddress.url}</a>
    </li>`
  );
$('#results').removeClass('hidden');

}


function cleanPhysicalAddress(messyPhysAddress){
  console.log('clean is working');
  let physAddress = {};
  const removeEmptyAdress = (messyPhysAddress) => {
    const cleanPhysAddress = {};
      Object.keys(messyPhysAddress).forEach(key => {
        if (messyPhysAddress[key] && typeof messyPhysAddress[key] === 'object') removeEmptyAdress(messyPhysAddress[key]);
        else if (messyPhysAddress[key] == undefined) delete messyPhysAddress[key];
        //else if (obj[key] == null) delete obj[key];
        else if(messyPhysAddress[key]) cleanPhysAddress[key] = messyPhysAddress[key];
      });
    return cleanPhysAddress;
  };
  console.log(removeEmptyAdress(messyPhysAddress).line1,'cleaned up ')

  physAddress = removeEmptyAdress(messyPhysAddress);
//const physAddress = removeEmptyAdress(messyPhysAddress);
  console.log(physAddress, 'got it !!!!!')
  //return physAddress;
  displayResults(physAddress);
}

function getPhysicalAddress(json){
  const holdJsonInfo = [];
  
  json.data.forEach(element => {
    console.log(element.addresses, '!!!addresses')
    const addresses = element.addresses;
    console.log(addresses, 'address captured!');

    holdJsonInfo.push(element.fullName, element.url, element.description);
    console.log(holdJsonInfo, 'this is the hold info');
    holdJsonInfofunc(holdJsonInfo);
    const messyPhysAddress = addresses.filter(address => address.type === 'Physical')[0];
    console.log(messyPhysAddress, 'physicalAddress!!!!!');
    
    //const physicalAddress = cleanPhysicalAddress(messyPhysAddress);
    //console.log(physicalAddress, 'physical address works nicesly')// undefined
    console.log(json);
    cleanPhysicalAddress(messyPhysAddress);
  });
  
 // return messyPhysAddress;
//console.log(messyPhysAddress, 'did it go through?')
 // cleanPhysicalAddress(element);

}

function findParks(queryString){
  const url = npsURL + '?' + queryString;
  console.log('the url is', url);

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

function createQueryString(state, numResults){
  const params = {
    api_key: apiKey,
    stateCode: state,
    limit: numResults,
    start: 0,
    fields: 'addresses'
  };
  const queryString = `stateCode=${state}&limit=${numResults}&start=0&fields=addresses&api_key=${apiKey}`
  //.log(queryString);

 findParks(queryString);
}

function getStateCode(stateEntered){
 
  function getState(stateEntered){
    return states.filter(state => state.name.toLowerCase() === stateEntered.toLowerCase())[0];
  };

  const results = getState(stateEntered);
  //console.log(results, 'results')
  //const result = getState(stateEntered);
  if (results) {
    console.log('we should render our result back on the page');
  } else {
    console.log('we should render something on the page to show we did not get a result');
  };
    //console.log(results.abbrev)
    //const stateCode = ;
console.log(results.abbrev, 'stateCode')
  
  return results.abbrev;
  //return stateCode;
   // findParks()
}

function searchInitiated(){
  $('form').submit(event=> {
    event.preventDefault();
    const stateEntered = $('#js-search-state').val();
    const numResults =$('#js-numEntered').val();
    //console.log(numResults, 'number entered');
    getStateCode(stateEntered);
    //returns stateCode here
    const stateCode = getStateCode(stateEntered);
    //console.log(stateCode, 'stateCode found');
  
    createQueryString(stateCode, numResults);
    //functiholdJsonInfofunc();
    //findParks(stateCode);
    /*
    const results = getState(stateEntered);
    console.log(results, 'results')
    const result = getState(stateEntered);
    if (result) {
      console.log('we should render our result back on the page');
    } else {
      console.log('we should render something on the page to show we did not get a result');
    }
    */

  });
}

$(searchInitiated);