const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropDownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropDownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart');

let city = [];

const citiesApi = 'database/cities.json',
    PROXY = 'https://cors-anywhere.herokuapp.com/'
    API_KEY = '3fabc10e29175a675a9ebffdb249bf41',
    caledar = 'http://min-prices.aviasales.ru/calendar_preload';

// Функция получения данных с сервера
const getData = (url, callBack) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', ()=>{
        if (request.readyState !== 4) return;

        if(request.status === 200) {
            callBack(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
}

//Функция автодополнения списка городов
const showCity = (input, list) => {
    list.textContent = '';

    if (!input.value) return;

    const filtercity = city.filter((item) => {
        return item.name.toLowerCase().includes(input.value.toLowerCase());
    });
    
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

//Ищем билеты на 25.05.20 
let showTicket = () => {
    const srcCity = city.find(item => item.name === 'Екатеринбург'),
        destCity = city.find(item => item.name === 'Калининград'),
        depart_date = '2020-05-25',
        one_way = false,
        url = caledar + `?origin=${srcCity.code}&destination=${destCity.code}&depart_date=${depart_date}&one_way=${one_way}`;
    getData(url, data => console.log(data));
};

//Загрузка данных
getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    showTicket();
});

