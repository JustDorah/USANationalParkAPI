'use strict';
// Base  URL with endpoint /parks
const npsURL = 'https://developer.nps.gov/api/v1/parks';

//API key
const apiKey = 'w2zeUfQTPXBoIT154Rrc0JmxIpdIMAbXPlbpgkIc';

//display results
function displayResults(physAddress, info) {
   

    $('#js-results-list').append(
        `<li>
        <h2>${info.fullName}</h2>
        <p>${info.description} <a href="${info.url}" target="_blank">${info.url}</a></p>
       
        <a href="https://google.com/maps/search/${info.fullName}" target="_blank">${physAddress.line1}<br>${physAddress.line2}, ${physAddress.city}, ${physAddress.stateCode} ${physAddress.postalCode}</a>
        </li>`
    );
    $('#results').removeClass('hidden');
}

//create a clean usable address object
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
    console.log(removeEmptyAdress(messyPhysAddress).line1, 'cleaned up ')

    physAddress = removeEmptyAdress(messyPhysAddress);
    console.log('got it !!!!!', physAddress, 'got it !!!!!')
    
    //return physAddress;
    displayResults(physAddress, info);
}


function getPhysicalAddress(json) {
    const holdJsonInfo = [];
    $('#js-results-list').empty();
    json.data.forEach(element => {
        console.log(element.addresses, '!!!addresses')
        const addresses = element.addresses;
        console.log(addresses, 'address captured!');


        const messyPhysAddress = addresses.filter(address => address.type === 'Physical')[0];
        console.log(messyPhysAddress, 'physicalAddress!!!!!');

        //console.log(json);
        cleanPhysicalAddress(messyPhysAddress, {fullName: element.fullName, url: element.url, description: element.description});
    });

}

function findParks(queryString) {
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

function createQueryString(state, numResults) {
    const params = {
        api_key: apiKey,
        stateCode: state,
        limit: numResults,
        start: 0,
        fields: 'addresses'
    };
    const queryString = `stateCode=${state}&limit=${numResults}&start=0&fields=addresses&api_key=${apiKey}`
    //console.log(queryString);

    findParks(queryString);
}

//convert user's entry into the acceptable state code
function getStateCode(stateEntered) {

    function getState(stateEntered) {
        return states.filter(state => state.name.toLowerCase() === stateEntered.toLowerCase() || state.abbrev.toLowerCase() === stateEntered.toLowerCase())[0];
    };
    const results = getState(stateEntered);
    //console.log(results, 'results')
       
    //console.log(results.abbrev, 'stateCode')
    return results.abbrev;
}

function searchInitiated() {
    $('form').submit(event => {
        event.preventDefault();
        const stateEntered = $('#js-search-state').val();
        const numResults = $('#js-numEntered').val();
        //console.log(numResults, 'number entered');
       
        getStateCode(stateEntered);
        //returns stateCode here
        
        const stateCode = getStateCode(stateEntered);
        //console.log(stateCode, 'stateCode found');

        //test to see if we got our state
        if (stateCode) {
            console.log('we should render our state code back on the page');
        } else {
            console.log('we should render something on the page to show we did not get a state code');
        };
    
        createQueryString(stateCode, numResults);      
    });
}



$(searchInitiated);