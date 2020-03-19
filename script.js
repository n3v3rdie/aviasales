const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropDownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropDownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart');

const city = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Северодвинск',
    'Архангельск', 'Новодвинск', 'Ухань', 'Волгоград', 'Нижний-Новгород',
    'Керч', 'Калининград', 'Ростов на дону', 'Одесса', 'Караганда'];

const showCity = (input, list) => {
    list.textContent = '';

    if (!input.value) return;

    const filtercity = city.filter((item) => {
        return item.toLowerCase().includes(input.value.toLowerCase());
    });
    
    filtercity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item;
        list.append(li);
    });
};

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
