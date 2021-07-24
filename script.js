let getData = async ()=>{
    let data = await axios.get("https://corona-api.com/countries");
    console.log(data.data.data[0].latest_data);
}

getData();