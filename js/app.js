let gallery = document.querySelector('#gallery');

/*
*   fetchData Helper
*/

function fetchData(url) {
    return fetch(url)
    .then(res => res.json())
    .then(res => res.results);
}

/* 
*   Build User Search
*/

function buildSearch() {
    let container = document.querySelector('.search-container');
    let html = `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
    container.innerHTML = html;

    let search = container.querySelector('#search-input');
    let searchButton = container.querySelector('#search-submit')
    search.addEventListener('change', e => {
        searchUsers(search.value);
    });
    search.addEventListener('keyup', e => { 
        searchUsers(search.value);
    });
    searchButton.addEventListener('click', e => {
        searchUsers(search.value);
    });
}

/* 
*   Search Users
*/

 function searchUsers (search) {
     let users = document.querySelectorAll('.card');
     users.forEach(user => {
        let nameBox = user.querySelector('.card-name');
        let name = nameBox.textContent.toLowerCase();
        user.style.display = 'flex';
        let validSearch = search.length > 0;
        if (validSearch) {
            let visible = name.includes(search.toLowerCase());
            if (!visible) {
                user.style.display = 'none';
            }
        } else {
            user.style.display = 'flex';
        }
     });
 }

/*
*   Gather Employee Data
*/

//Grab 12 random employees, add to employeeList.
async function buildEmployeeList() { 
    let employeeList = [];
    employeeList = await fetchData('https://randomuser.me/api/?results=12&nat=US&inc=name,email,location,dob,phone,picture')
    buildEmployeeGrid(employeeList);
    buildSearch();
}

/*
*   Employee Class
*/

class Employee {
    constructor(employee) {
        this.employee = {
            first: employee.name.first,
            last: employee.name.last,
            picture: employee.picture,
            email: employee.email,
            location: employee.location,
            phone: employee.phone,
            dob: this.formatDob(employee.dob),
        };
        this.container = null;
        this.modal = null;
    }

    // Format Date
    // dob.date = 1952-10-10T10:20:15.968Z to 10/10/1952
    formatDob(raw) {
        let year, month, day;
        let dob = raw.date;
        year = dob.substring(0,4);
        month = dob.substring(5,7);
        day = dob.substring(8,10);
        return `${month}/${day}/${year}`;
    }

    buildModal () {
        this.modal = new Modal(this.employee);
        this.modal.build();
    }

    setEvents() {
        let context = this;
        context.container.addEventListener('click', () => { context.modal.open() });
    }

    init () {
        this.container = document.createElement('div');
        this.container.className = 'card';
        let inner = `
            <div class="card-img-container">
                <img class="card-img" src="${this.employee.picture.medium}" alt="Picture of ${this.employee.first} ${this.employee.last}">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${this.employee.first} ${this.employee.last}</h3>
                <p class="card-text">${this.employee.email}</p>
                <p class="card-text cap">${this.employee.location.city}, ${this.employee.location.state}</p>
            </div>
        `;
        this.container.insertAdjacentHTML('beforeend', inner);
        gallery.append(this.container);
        this.buildModal();
        this.setEvents();
    }

}

/*
*   Build Employee Grid List
*/
let employees = {};
function buildEmployeeGrid (list) {
    for (employee of list) {
        let newEmployee = new Employee(employee);
        employees[employee.name.first] = newEmployee;
        newEmployee.init();
    }
}

/* 
*   Modal Class
*   Build a new modal for each employee.
*/

class Modal {
    constructor(employee) {
        this.employee = employee;
        this.container = null;
    }

    build () {
        this.container = document.createElement('div');
        this.container.className = 'modal-container';
        let inner = `<div class='modal-inner'>
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${this.employee.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${this.employee.first} ${this.employee.last}</h3>
                    <p class="modal-text">${this.employee.email}</p>
                    <p class="modal-text cap">${this.employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${this.employee.phone}</p>
                    <p class="modal-text">${this.employee.location.street.number} ${this.employee.location.street.name}, ${this.employee.location.city}, ${this.employee.location.state} ${this.employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${this.employee.dob}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`;
        this.container.insertAdjacentHTML('beforeend', inner); //append modal contents to modal.
        document.body.append(this.container); //add html to page body.
        this.close(); //keep closed by default
        this.setEvents();
    }

    open () {
        this.container.style.display = 'block';
    }

    close () {
        this.container.style.display = 'none';
    }

    next () {
        this.close();
        let next = this.container.nextSibling;
        if (!next || next.nodeName === '#text') { return; }
        next.style.display = 'block';
    }

    prev () {
        this.close();
        let prev = this.container.previousSibling;
        if (!prev || prev.nodeName === '#text') { return; }
        prev.style.display = 'block';
    }

    setEvents () {
        let context = this;
        let close = context.container.querySelector('.modal-close-btn');
        close.addEventListener('click', e => {
            context.close();
        });
        let next = context.container.querySelector('.modal-next');
        next.addEventListener('click', e => {
            context.next();
        });
        let prev = context.container.querySelector('.modal-prev');
        prev.addEventListener('click', e => {
            context.prev();
        });
    }

    // <div class="modal-container">
    //     <div class="modal">
    //         <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    //         <div class="modal-info-container">
    //             <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
    //             <h3 id="name" class="modal-name cap">name</h3>
    //             <p class="modal-text">email</p>
    //             <p class="modal-text cap">city</p>
    //             <hr>
    //             <p class="modal-text">(555) 555-5555</p>
    //             <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
    //             <p class="modal-text">Birthday: 10/21/2015</p>
    //         </div>
    //     </div>

    //     // IMPORTANT: Below is only for exceeds tasks 
    //     <div class="modal-btn-container">
    //         <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    //         <button type="button" id="modal-next" class="modal-next btn">Next</button>
    //     </div>
    // </div>

}


/* 
*   Initialize Random Generator App
*/

buildEmployeeList();