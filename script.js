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
const canvas = document.querySelector('#chart');
const canvasParent = document.querySelector('.canvas-parent');

const monthNames = ['Jan', 'Feb','Mar','Apr','May', 'June', 'July','Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getUTCFullYear();

let searchCountry = 'India';
let countryCode= "IN";

let getData = async (searchCountry,link) => {
    try {
        let countryWiseCases = await axios.get(link, {params:{include: 'timeline'}});
        countryCode = updateOverallData(searchCountry, countryWiseCases);

    } catch(err) {
        console.log("OOPs looks like some error has occured",err);
    }
}

let updateOverallData = (searchCountry, countryWiseCases) => {
    let code;
    for (data of countryWiseCases.data.data) {
        if (searchCountry.toLowerCase() == data.name.toLowerCase()) {
            console.log(data);

            countryName.innerText = data.name;
            overallDeaths.innerText = data.latest_data.deaths;
            overallConfirmed.innerText = data.latest_data.confirmed;
            overallRecovered.innerText = data.latest_data.recovered;
            overallCritical.innerText = data.latest_data.critical;

            code = data.code;
            let {timeline} = data;
            yesterdayConfirmed.innerText = timeline[0].new_confirmed;
            yesterdayDeaths.innerText = timeline[0].new_deaths;
            yesterdayRecovered.innerText = timeline[0].new_recovered;
            lastUpdated.innerText = `Last updated ${timeline[0].updated_at.slice(0,10)} ${timeline[0].updated_at.slice(11,19)}`;
            break;
        }

    }
    return code;
}


let basicDataLink = "https://corona-api.com/countries";

let monthsOnGraph = (currentMonth, currentYear) =>{
    let dateFormatting = (month)=>{
        if(month / 10 < 1){
            return `0${month}`;
        }else{
            return month.toString();
        }
    }
    let graphMonths = [];
    let graphDateNYear = [];
    for(let i = 11;  i >= 0; i--){
        if(currentMonth - i <= 0){
            graphMonths.push(monthNames[currentMonth - i + monthNames.length] + ` ${currentYear-1}`);
            graphDateNYear.push(`${currentYear-1}-${dateFormatting(currentMonth -i + monthNames.length)}`);
            // console.log(currentMonth - i + monthNames.length);
        }else{
            graphMonths.push(monthNames[currentMonth - i] + ` ${currentYear}`);
            graphDateNYear.push(`${currentYear}-${dateFormatting(currentMonth-i+1)}`);
            // console.log(currentMonth-i+1);
        }
    }
    return [graphMonths, graphDateNYear];
}

let [graphMonths, graphDateNYear] = monthsOnGraph(currentMonth, currentYear);
console.log(graphDateNYear);

let totalCasesPerMonth = (detailedCountryWiseCases)=>{
    let monthlyConfirmedCases = [0,0,0,0,0,0,0,0,0,0,0,0];
    let monthyRecoveredCases = [0,0,0,0,0,0,0,0,0,0,0,0];
    let monthlyDeathCases = [0,0,0,0,0,0,0,0,0,0,0,0];
    for(day of detailedCountryWiseCases.data.data.timeline){
        if(graphDateNYear.includes(day.date.slice(0,7))){
            monthlyConfirmedCases[graphDateNYear.indexOf(day.date.slice(0,7))] += day.new_confirmed;
            monthlyDeathCases[graphDateNYear.indexOf(day.date.slice(0,7))] += day.new_deaths; 
            monthyRecoveredCases[graphDateNYear.indexOf(day.date.slice(0,7))] += day.new_recovered;
        }
    }
    return [monthlyConfirmedCases, monthyRecoveredCases, monthlyDeathCases];
}

let monthlyConfirmedCases = [];
let monthyRecoveredCases = [];
let monthlyDeathCases = [];

let getDataForGraph = async(countryCode)=>{
    let completeDataLink = basicDataLink + "\\" + countryCode;
    let detailedCountryWiseCases = await axios.get(completeDataLink);
    [monthlyConfirmedCases, monthyRecoveredCases, monthlyDeathCases] = totalCasesPerMonth(detailedCountryWiseCases);
    return [monthlyConfirmedCases, monthyRecoveredCases, monthlyDeathCases];
}

let response;
getDataForGraph(countryCode).then((res)=>{
    const canvas1 = document.querySelector('#chart1');
    const canvas2 = document.querySelector('#chart2');
    const chart1 = new Chart(canvas1, {
        type: 'line',
        labels:'Cases',
        data:{
            labels: graphMonths,
            datasets : [{
                label: 'Confirmed',
                data:res[0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    '#F71900'
                ],
                borderWidth: 3,
            },
            {
                label: 'Recovered',
                data:res[1],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    '#58BC34'
                ],
                borderWidth: 3,
            },
            {
                label: 'Deaths',
                data: res[2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'grey'
                ],
                borderWidth: 3,
            },
        ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
            elements:{
                line:{
                    backgroundColor: 'rgba(255,0,0,.5)',
                }
            },
            maintainAspectRatio : false,
        }
    });

    const chart2 = new Chart(canvas2, {
        type: 'line',
        labels:'Cases',
        data:{
            labels: graphMonths,
            datasets : [
            {
                label: 'Deaths',
                data: res[2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'grey'
                ],
                borderWidth: 3,
            },
        ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
            elements:{
                line:{
                    backgroundColor: 'rgba(255,0,0,.5)',
                }
            },
            maintainAspectRatio : false,
        }
    });   
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchCountry = searchBar.value;
    getData(searchCountry, basicDataLink);
    getDataForGraph(countryCode);
})


