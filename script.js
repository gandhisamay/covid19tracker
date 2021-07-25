const form = document.querySelector('.navmain form');
const searchBar = document.querySelector('.navmain input');

const overallDeaths = document.querySelector('#overall-deaths');
const overallConfirmed = document.querySelector('#overall-confirmed');
const overallRecovered = document.querySelector('#overall-recovered');
const overallCritical = document.querySelector('#overall-critical');
const todayDeaths = document.querySelector('#today-deaths');
const todayConfirmed = document.querySelector('#today-confirmed');
const countryName = document.querySelector('.country');

let searchCountry;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchCountry = searchBar.value;
    getData(searchCountry);
})

let getData = async (searchCountry) => {
    try {
        let countryWiseCases = await axios.get("https://corona-api.com/countries");
        for (data of countryWiseCases.data.data) {
            if (searchCountry.toLowerCase() == data.name.toLowerCase()) {
                console.log(data.name);

                countryName.innerText = data.name;
                overallDeaths.innerText = data.latest_data.deaths;
                overallConfirmed.innerText = data.latest_data.confirmed;
                overallRecovered.innerText = data.latest_data.recovered;
                overallCritical.innerText = data.latest_data.critical;

                todayConfirmed.innerText = data.today.confirmed;
                todayDeaths.innerText = data.today.deaths;
                break;
            }

        }
    } catch{
        console.log("OOPs looks like some error has occured");
    }
}
