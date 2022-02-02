
//Awesome Startup
//
//Grab 12 random employees from https://randomuser.me/
//Request a JSON Object from the API and parse 12 employees to list in a grid with:
//Name
//Email
//Location
//Clicking the employees image or name will open a modal window with more detailed information.
//Birthday
//Address

/*
*   fetchData Helper
*/

function fetchData(url) {
    return fetch(url)
    .then(res => res.json())
    .then(res => res.results);
}

/*
*   Gather Employee Data
*/

//Grab 12 random employees, add to employeeList.
async function buildEmployeeList() { 
    let employeeList = [];
    employeeList = await fetchData('https://randomuser.me/api/?results=12&nat=US&inc=name,email,location,dob,picture');
    buildEmployeeGrid(employeeList);
}

/*
*   Build Employee Grid List
*/

function buildEmployeeGrid (list) {
    let gallery = document.querySelector('#gallery');
    let employees = '';
    for (employee of list) {
        employees += `<div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.medium}" alt="Picture of ${employee.name.first} ${employee.name.last}">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>`;
    }
    gallery.insertAdjacentHTML('beforeend', employees);
}

/* 
*   Modal Instance
*/

class Modal() {
    constructor() {
        
    }

}


/* 
*   Initialize Random Generator App
*/

buildEmployeeList();