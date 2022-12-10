import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// body.style.backgroundImage =
//   'url(https://cdn.pixabay.com/photo/2021/05/08/10/14/circles-6238091_960_720.jpg)';
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('input#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

function onInputHandler(e) {
  const inputValue = e.target.value.trim();
  const urlAPI = `https://restcountries.com/v3.1/name/${inputValue}?fields=name,capital,population,flags,languages`;
  if (inputValue === '') {
    countryListRef.innerHTML = '';
    return;
  }
  fetch(urlAPI)
    .then(response => {
      //   if (!response.ok)
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(country => {
      console.log(country);
      render(country);
    })
    .catch(error => {
      console.log(error);
    });
}
inputEl.addEventListener('input', debounce(onInputHandler, DEBOUNCE_DELAY));

function render(articles) {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';

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

  if (articles.length < 2) {
    countryInfoRef.insertAdjacentHTML('beforeend', countriesInfo.join(''));
  } else {
    countryListRef.insertAdjacentHTML('beforeend', countriesName.join(''));
    countryInfoRef.insertAdjacentHTML('beforeend', countriesInfo.join(''));
  }
}
