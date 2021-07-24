const search = document.querySelector('form');
const input = document.querySelector('.form-control')

let getData = async ()=>{
    let countryWiseCases = await axios.get("https://corona-api.com/countries/AF");
    console.log(countryWiseCases);
}

getData();

search.addEventListener('submit', (e)=>{
    e.preventDefault();
    console.log(input.value);
})



