const apiKey='298949921e8229b3e70c0ae7788b2004';
const apiUrl='https://api.openweathermap.org/data/2.5/weather';

const unosLokacije = document.getElementById('unosLokacije');
const gumbPretrazi = document.getElementById('gumbPretrazi');
const grad = document.getElementById('grad');
const drzava = document.getElementById('drzava');
const vrijeme = document.getElementById('vrijeme');
const temperatura = document.getElementById('temperatura');
const ikonica = document.getElementById('ikonica');

gumbPretrazi.addEventListener('click', () =>{
    const lokacija = unosLokacije.value;
    if(lokacija)
    {
        getWeatherByLocation(lokacija);
    }
    else 
    {
        window.alert("Naziv grada ne može ostati prazan.");
    }
})

function getWeatherByLocation(lokacija){
    const url = `${apiUrl}?q=${lokacija}&appid=${apiKey}`;

    fetch(url)
    .then(response =>{
        if (!response.ok) {
            throw new Error("Neispravna lokacija. Molim vas unesite ispravni naziv grada.");
        }
        return response.json();
    })
    .then(data => {
        console.log(JSON.stringify(data));

        grad.innerHTML = data.name;
        drzava.innerHTML = data.sys.country;
        vrijeme.innerHTML = data.weather[0].main;
        temperatura.innerHTML = Math.round(data.main.temp - 273.15) + '°C';

        setBackgroundImage(data.sys.country);

        switch(data.weather[0].main)
        {
            case 'Clear':
                ikonica.src = "./slike/vrijeme/vedro.png";
                break;
            case 'Clouds':
                ikonica.src = "./slike/vrijeme/oblak.png";
                break;
            case 'Rain':
                ikonica.src = "./slike/vrijeme/kisa.png";
                break;
            case 'Drizzle':
                ikonica.src = "./slike/vrijeme/rosulja.png";
                break;
            case 'Thunderstorm':
                ikonica.src = "./slike/vrijeme/grmljavina.png";
                break;
            case 'Snow':
                ikonica.src = "./slike/vrijeme/snijeg.png";
                break;
            case 'Mist':
                ikonica.src = "./slike/vrijeme/magla.png";
                break;
            case 'Smoke':
                ikonica.src = "./slike/vrijeme/dim.png";
                break;
            case 'Haze':
                ikonica.src = "./slike/vrijeme/izmaglica.png";
                break;
            case 'Dust':
                ikonica.src = "./slike/vrijeme/prasina.png";
                break;
            case 'Fog':
                ikonica.src = "./slike/vrijeme/magla2.png";
                break;
            case 'Sand':
                ikonica.src = "./slike/vrijeme/pijesak.png";
                break;
            case 'Ash':
                ikonica.src = "./slike/vrijeme/pepeo.png";
                break;
            case 'Squall':
                ikonica.src = "./slike/vrijeme/vjetar.png";
                break;
            case 'Tornado':
                ikonica.src = "./slike/vrijeme/tornado.png";
                break;
            default:
                ikonica.src = "./slike/vrijeme/blank.png";
                break;
        }
    })
    .catch(error => {
        console.log(error);
        window.alert(error.message);
    })
}

function setBackgroundImage(drzava)
{
    const afrika = ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "CD", "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "EH", "ZM", "ZW"];
    const azija = ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "KP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "KR", "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE"];
    const europa = ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "GE", "DE", "GR", "HU", "IS", "IE", "IT", "XK", "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "VA"];
    const sAmerika = ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GD", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"];
    const jAmerika = ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"];
    const australija = ["AS", "AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "WS", "SB", "TO", "TV", "VU"];

    if(afrika.includes(drzava))
    {
        document.body.style.background = "url('./slike/kontinenti/afrika.jpg')";
    }
    else if(azija.includes(drzava))
    {
        document.body.style.background = "url('./slike/kontinenti/azija.jpeg')";
    }
    else if(europa.includes(drzava))
    {
        document.body.style.background = "url('./slike/kontinenti/europa.jpg')";
    }
    else if(sAmerika.includes(drzava))
    {
        document.body.style.background = "url('./slike/kontinenti/sAmerika.jpg')";
    }
    else if(jAmerika.includes(drzava))
    {
        document.body.style.background = "url('./slike/kontinenti/jAmerika.jpg')";
    }
    else if(australija.includes(drzava))
    {
        document.body.style.background = "url('./slike/kontinenti/australija.jpg')";
    }
    else
    {
        document.body.style.background = "url('./slike/kontinenti/antarktika.jpg')";
    }

}

