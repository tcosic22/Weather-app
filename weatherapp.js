const apiKey='298949921e8229b3e70c0ae7788b2004';
const apiUrl='https://api.openweathermap.org/';

const inputLocation = document.getElementById('inputLocation');
const buttonSearch = document.getElementById('buttonSearch');
const city = document.getElementById('city');
const country = document.getElementById('country');
const weather = document.getElementById('weather');
const temperature = document.getElementById('temperature');
const icon = document.getElementById('icon');

buttonSearch.addEventListener('click', () =>{
    const location = inputLocation.value;
    if(location)
    {
        getWeatherByLocation(location);
        getWeatherByLocation5Days(location);
    }
    else 
    {
        window.alert("City name can't be blank.");
    }
})

function getWeatherByLocation(location){
    const url = `${apiUrl}data/2.5/weather?q=${location}&appid=${apiKey}`;

    fetch(url)
    .then(response =>{
        if (!response.ok) {
            throw new Error("Invalid location. Please enter a valid city name.");
        }
        return response.json();
    })
    .then(data => {

        city.innerHTML = data.name;
        country.innerHTML = data.sys.country;
        weather.innerHTML = data.weather[0].main;
        temperature.innerHTML = Math.round(data.main.temp - 273.15) + '°C';

        setIcon(data.weather[0].main);
        setBackgroundImage(data.sys.country);

    })
    .catch(error => {
        console.log(error);
        window.alert(error.message);
    })
}

async function getWeatherByLocation5Days(location){

    const [latitude, longitude] = await getLatitudeAndLongitude(location);

    const url = `${apiUrl}data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const forecast = data.list;
        const forecastByDay = {};

        forecast.forEach(day => {
            const date = new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'long'});
            if (!forecastByDay[date]) {
                forecastByDay[date] = [];
            }
            forecastByDay[date].push(day);
        });

        const forecastContainer = document.getElementById('fiveDayForecast'); 
        forecastContainer.innerHTML = "";

        let index = 0;
        let skipToday = false;

        Object.entries(forecastByDay).forEach(([date, dailyForecast]) => {
            if(!skipToday)
            {
                skipToday = true;
                return;
            }

            if (index < 5)
            {
                const podnePrognoza = dailyForecast.find(p => p.dt_txt.includes('12:00:00')) || dailyForecast[0];

                const tempToday = podnePrognoza.main.temp;
                const tempMin = Math.min(...dailyForecast.map(p => p.main.temp_min));
                const tempMax = Math.max(...dailyForecast.map(p => p.main.temp_max));
                const weather = podnePrognoza.weather[0].main;

                const forecastHTML = `
                    <div class="day">
                        <h3>${date}</h3>
                        <p>weather: ${weather}</p>
                        <p>temperature: ${tempToday}°C</p>
                        <p>Min: ${tempMin}°C, Max: ${tempMax}°C</p>
                    </div>
                `;

                forecastContainer.innerHTML += forecastHTML;

                setIcon(weather);

                index++;
            }
        });


    })
    .catch(error => {
        console.error("Error while retrieving forecast:", error);
    });
}

async function getLatitudeAndLongitude(location){
    const url = `${apiUrl}geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json(); 
    const latitude = data[0].lat;
    const longitude = data[0].lon;

    return [latitude, longitude];
}

function setIcon(weather){
    
    switch(weather)
        {
            case 'Clear':
                icon.src = "./pictures/weather/clear.png";
                break;
            case 'Clouds':
                icon.src = "./pictures/weather/clouds.png";
                break;
            case 'Rain':
                icon.src = "./pictures/weather/rain.png";
                break;
            case 'Drizzle':
                icon.src = "./pictures/weather/drizzle.png";
                break;
            case 'Thunderstorm':
                icon.src = "./pictures/weather/thunderstorm.png";
                break;
            case 'Snow':
                icon.src = "./pictures/weather/snow.png";
                break;
            case 'Mist':
                icon.src = "./pictures/weather/mist.png";
                break;
            case 'Smoke':
                icon.src = "./pictures/weather/smoke.png";
                break;
            case 'Haze':
                icon.src = "./pictures/weather/haze.png";
                break;
            case 'Dust':
                icon.src = "./pictures/weather/dust.png";
                break;
            case 'Fog':
                icon.src = "./pictures/weather/fog.png";
                break;
            case 'Sand':
                icon.src = "./pictures/weather/sand.png";
                break;
            case 'Ash':
                icon.src = "./pictures/weather/ash.png";
                break;
            case 'Squall':
                icon.src = "./pictures/weather/squall.png";
                break;
            case 'Tornado':
                icon.src = "./pictures/weather/tornado.png";
                break;
            default:
                icon.src = "./pictures/weather/blank.png";
                break;
        }
}

function setBackgroundImage(country)
{
    const africa = ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "CD", "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "EH", "ZM", "ZW"];
    const asia = ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "KP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "KR", "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE"];
    const europe = ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "GE", "DE", "GR", "HU", "IS", "IE", "IT", "XK", "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "VA"];
    const nAmerica = ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GD", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"];
    const sAmerica = ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"];
    const australia = ["AS", "AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "WS", "SB", "TO", "TV", "VU"];

    if(africa.includes(country))
    {
        document.body.style.background = "url('./pictures/continents/africa.jpg')";
    }
    else if(asia.includes(country))
    {
        document.body.style.background = "url('./pictures/continents/asia.jpeg')";
    }
    else if(europe.includes(country))
    {
        document.body.style.background = "url('./pictures/continents/europe.jpg')";
    }
    else if(nAmerica.includes(country))
    {
        document.body.style.background = "url('./pictures/continents/nAmerica.jpg')";
    }
    else if(sAmerica.includes(country))
    {
        document.body.style.background = "url('./pictures/continents/sAmerica.jpg')";
    }
    else if(australia.includes(country))
    {
        document.body.style.background = "url('./pictures/continents/australia.jpg')";
    }
    else
    {
        document.body.style.background = "url('./pictures/continents/antarctica.jpg')";
    }

}

