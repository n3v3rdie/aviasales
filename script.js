const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropDownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropDownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart');
    cheapestTicket = document.getElementById('cheapest-ticket'),
	otherCheapTickets = document.getElementById('other-cheap-tickets');

let city = [];

const citiesApi = 'database/cities.json',
    PROXY = 'https://cors-anywhere.herokuapp.com/'
    API_KEY = '3fabc10e29175a675a9ebffdb249bf41',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    MAX_COUNT = 10;

// Функция получения данных с сервера
const getData = (url, callBack, reject = console.error) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', ()=>{
        if (request.readyState !== 4) return;

        if(request.status === 200) {
            callBack(request.response);
        } else {
            reject(request.status);
        }
    });

    request.send();
}

//Функция автодополнения списка городов
const showCity = (input, list) => {
    list.textContent = '';

    if (!input.value) return;

    const filtercity = city.filter((item) => {
        return item.name.toLowerCase().startsWith(input.value.toLowerCase());
    }).sort((a,b) => a.name > b.name);// сортировка по имени
    
    filtercity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);
    });
};

//Функция выбора города
const onCityClick = (input, list, event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li'){
        input.value = target.textContent;
        list.textContent = '';
    }
};

const getChanges = (num) => {
    if(num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок';
    }
};

const getNameCity = (code) => {
    const objCity = city.find(item => item.code === code);
    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';
    link += data.origin;

    const date = new Date(data.depart_date);
    const day = date.getDate();

    link += day < 10 ? '0' + day : day;
    const month = date.getMonth() + 1;
    link += month < 10 ? '0' + month : month;

    link += data.destination;
    link += '1';

    return link;
};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};


const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

    cheapTickets.sort((a, b) => a.value - b.value);

    for(let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';


    if(data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>
                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3>На текущую дату билетов нет</h3>';
    }



    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};



const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    const cheapTicketDay = cheapTicketYear.filter((item) => {
         return item.depart_date === date;
    })
    // сортировка по датам
    const cheapTicketYearSort = cheapTicketYear.sort((a,b) => a.depart_date > b.depart_date);

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYearSort);
};

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropDownCitiesFrom);
});

dropDownCitiesFrom.addEventListener('click', (event) => {
    onCityClick(inputCitiesFrom, dropDownCitiesFrom, event);
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropDownCitiesTo);
});

dropDownCitiesTo.addEventListener('click', (event) => {
    onCityClick(inputCitiesTo, dropDownCitiesTo, event);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityFrom = city.find(item => item.name === inputCitiesFrom.value),
        cityTo = city.find(item => item.name === inputCitiesTo.value);
    
    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value
    };

    if(formData.from && formData.to) {
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`; 
    
        getData(calendar + requestData, (data) => {
                    renderCheap(data, formData.when);
                }, 
                (error) => {
                    cheapestTicket.style.display = 'block'
		            cheapestTicket.innerHTML = '<h2>В данном направлении нет рейсов</h2>'
                });
    } else {
        cheapestTicket.style.display = 'block'
		cheapestTicket.innerHTML = '<h2>Неверно указано имя города!</h2>'
    }
});

//Ищем билеты на 25.05.20 
let showTicket = () => {
    const srcCity = city.find(item => item.name === 'Екатеринбург'),
        destCity = city.find(item => item.name === 'Калининград'),
        depart_date = '2020-05-25',
        one_way = false,
        url = calendar + `?origin=${srcCity.code}&destination=${destCity.code}&depart_date=${depart_date}&one_way=${one_way}`;
    getData(url, data => console.log(data));
};

//Загрузка данных
getData(citiesApi, (data) => city = JSON.parse(data).filter(item => item.name));



