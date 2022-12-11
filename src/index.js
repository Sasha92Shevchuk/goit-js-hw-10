import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

// body.style.backgroundImage =
//   'url(https://cdn.pixabay.com/photo/2021/05/08/10/14/circles-6238091_960_720.jpg)';
const DEBOUNCE_DELAY = 300;

const endPoint = 'https://restcountries.com/v3.1/name/';
const searchParams = '?fields=name,capital,population,flags,languages';

const inputEl = document.querySelector('input#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

function onInputHandler(e) {
  const inputValue = e.target.value.trim();
  const urlAPI = `${endPoint}${inputValue}${searchParams}`;
  if (inputValue === '') {
    countryListRef.innerHTML = '';
    return;
  }

  fetchCountries(inputValue)
    .then(country => {
      //   console.log(country);
      if (country.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            timeout: 3000,
          }
        );
        countryListRef.innerHTML = '';
        return;
      }
      render(country);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name', {
        timeout: 3000,
      });
      clearInfo();
    });
}
inputEl.addEventListener('input', debounce(onInputHandler, DEBOUNCE_DELAY));

function render(articles) {
  clearInfo();

  const countriesName = articles.map(({ name, flags }) => {
    return `<li class="item">
  <img src="${flags.svg}" alt="flag ${name.official}" height = 15px width = 30px>
  <h2 class="country">${name.official}</h2>
  </li>`;
  });

  const countriesInfo = articles.map(({ capital, population, languages }) => {
    return `<p class="capital">Capital: <span>${capital}</span></p>
  <p class="population">Population: <span>${population}</span> </p> 
  <p class="languages">Languages: <span>${Object.values(languages)}</span></p>`;
  });

  if (articles.length !== 1) {
    countryListRef.insertAdjacentHTML('beforeend', countriesName.join(''));
  } else {
    countryListRef.insertAdjacentHTML('beforeend', countriesName.join(''));
    countryInfoRef.insertAdjacentHTML('beforeend', countriesInfo.join(''));
  }
}

function clearInfo() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}
