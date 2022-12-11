const endPoint = 'https://restcountries.com/v3.1/name/';
const searchParams = '?fields=name,capital,population,flags,languages';

export function fetchCountries(searchCountry) {
  const urlAPI = `${endPoint}${searchCountry}${searchParams}`;
  return fetch(urlAPI).then(response => {
    //   if (!response.ok)
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    // console.log(response.json());
    return response.json();
  });
}
