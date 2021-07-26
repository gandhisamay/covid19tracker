const form = document.querySelector('.navmain form');
const searchBar = document.querySelector('.navmain input');

const overallDeaths = document.querySelector('#overall-deaths');
const overallConfirmed = document.querySelector('#overall-confirmed');
const overallRecovered = document.querySelector('#overall-recovered');
const overallCritical = document.querySelector('#overall-critical');
const yesterdayDeaths = document.querySelector('#yesterday-deaths');
const yesterdayConfirmed = document.querySelector('#yesterday-confirmed');
const yesterdayRecovered = document.querySelector('#yesterday-recovered');
const countryName = document.querySelector('.country');
const lastUpdated = document.querySelector('.last-updated');

let searchCountry = 'India';
let countryCode;

let updateOverallData = (searchCountry, countryWiseCases) => {
    for (data of countryWiseCases.data.data) {
        if (searchCountry.toLowerCase() == data.name.toLowerCase()) {
            console.log(data);

            countryName.innerText = data.name;
            overallDeaths.innerText = data.latest_data.deaths;
            overallConfirmed.innerText = data.latest_data.confirmed;
            overallRecovered.innerText = data.latest_data.recovered;
            overallCritical.innerText = data.latest_data.critical;

            let {timeline} = data;
            yesterdayConfirmed.innerText = timeline[0].new_confirmed;
            yesterdayDeaths.innerText = timeline[0].new_deaths;
            yesterdayRecovered.innerText = timeline[0].new_recovered;
            lastUpdated.innerText = `Last updated ${timeline[0].updated_at.slice(0,10)} ${timeline[0].updated_at.slice(11,19)}`;
            break;
        }

    }
}

let basicDataLink = "https://corona-api.com/countries";

let getData = async (searchCountry,link) => {
    try {
        let countryWiseCases = await axios.get(link, {params:{include: 'timeline'}});

        updateOverallData(searchCountry, countryWiseCases);

    } catch(err) {
        console.log("OOPs looks like some error has occured",err);
    }
}

getData(searchCountry, basicDataLink);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchCountry = searchBar.value;
    getData(searchCountry, basicDataLink);
})
