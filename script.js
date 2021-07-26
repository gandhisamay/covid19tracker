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
const ctx = document.querySelector('#confirmed-chart');

const chart = new Chart(ctx, {
    type: 'line',
    data:{
        labels:['Jan', 'Feb','Mar','May', 'June', 'July','Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets : [{
            labels: 'Covid Cases',
            data:[8,9,10,1,2,3,4,5,6,7,8,9],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 3,
        }],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

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
