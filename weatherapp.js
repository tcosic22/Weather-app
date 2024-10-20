const apiKey='298949921e8229b3e70c0ae7788b2004';
const apiUrl='https://api.openweathermap.org/';

//dohvaćanje elemenata iz HTML-a
const unosLokacije = document.getElementById('unosLokacije');
const gumbPretrazi = document.getElementById('gumbPretrazi');
const grad = document.getElementById('grad');
const drzava = document.getElementById('drzava');
const vrijeme = document.getElementById('vrijeme');
const temperatura = document.getElementById('temperatura');
const ikonica = document.getElementById('ikonica');

//dodavanje event listenera na gumb
gumbPretrazi.addEventListener('click', () =>{
    const lokacija = unosLokacije.value;
    if(lokacija)
    {
        getWeatherByLocation(lokacija);
        getWeatherByLocation5Days(lokacija);
    }
    else 
    {
        window.alert("Naziv grada ne može ostati prazan.");
    }
})

//funkcija za dohvaćanje podataka o trenutnom vremenu
function getWeatherByLocation(lokacija){
    const url = `${apiUrl}data/2.5/weather?q=${lokacija}&appid=${apiKey}`;

    fetch(url)
    .then(response =>{
        if (!response.ok) {
            throw new Error("Neispravna lokacija. Molim vas unesite ispravni naziv grada.");
        }
        return response.json();
    })
    .then(data => {
        //console.log(JSON.stringify(data));

        grad.innerHTML = data.name;
        drzava.innerHTML = data.sys.country;
        vrijeme.innerHTML = data.weather[0].main;
        temperatura.innerHTML = Math.round(data.main.temp - 273.15) + '°C';

        setIcon(data.weather[0].main);
        setBackgroundImage(data.sys.country);

    })
    .catch(error => {
        console.log(error);
        window.alert(error.message);
    })
}

//funkcija za dohvaćanje podataka o vremenu za narednih 5 dana
async function getWeatherByLocation5Days(lokacija){

    const [geo_sirina, geo_duzina] = await getLatituteAndLongitude(lokacija);

    const url = `${apiUrl}data/2.5/forecast?lat=${geo_sirina}&lon=${geo_duzina}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        //console.log(JSON.stringify(data));
        const prognoze = data.list;
        const prognozaPoDanima = {};

        prognoze.forEach(dan => {
            const datum = new Date(dan.dt * 1000).toLocaleDateString('hr-HR', {weekday: 'long'});
            if (!prognozaPoDanima[datum]) {
                prognozaPoDanima[datum] = [];
            }
            prognozaPoDanima[datum].push(dan);
        });

        const prognozaContainer = document.getElementById('prognoza5dana'); 
        prognozaContainer.innerHTML = "";

        let index = 0;
        let preskociDanas = false;

        Object.entries(prognozaPoDanima).forEach(([datum, dnevnePrognoze]) => {
            if(!preskociDanas)
            {
                preskociDanas = true;
                return;
            }

            if (index < 5)
            {
                const podnePrognoza = dnevnePrognoze.find(p => p.dt_txt.includes('12:00:00')) || dnevnePrognoze[0];

                const tempDanas = podnePrognoza.main.temp;
                const tempMin = Math.min(...dnevnePrognoze.map(p => p.main.temp_min));
                const tempMax = Math.max(...dnevnePrognoze.map(p => p.main.temp_max));
                const vrijeme = podnePrognoza.weather[0].main;
                //console.log(`${datum}: ${vrijeme}, Temp: ${tempDanas}°C, Min: ${tempMin}°C, Max: ${tempMax}°C`);

                const prognozaHTML = `
                    <div class="dan">
                        <h3>${datum}</h3>
                        <p>Vrijeme: ${vrijeme}</p>
                        <p>Temperatura: ${tempDanas}°C</p>
                        <p>Min: ${tempMin}°C, Max: ${tempMax}°C</p>
                    </div>
                `;

                prognozaContainer.innerHTML += prognozaHTML;

                setIcon(vrijeme);

                index++;
            }
        });


    })
    .catch(error => {
        console.error("Greška prilikom dohvaćanja vremenskih podataka:", error);
    });
}

//funckija za dohvaćanje geografske dužine i širine za pojedini grad
async function getLatituteAndLongitude(lokacija){
    const url = `${apiUrl}geo/1.0/direct?q=${lokacija}&limit=1&appid=${apiKey}`;

    const response = await fetch(url); //cekanje da se izvrsi fetch
    const data = await response.json(); 
    const geo_sirina = data[0].lat;
    const geo_duzina = data[0].lon;

    return [geo_sirina, geo_duzina];
}

//funkcija za postavljanje ikonice ovisno o vremenskim uvjetima
function setIcon(vrijeme){
    
    switch(vrijeme)
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
}

//funkcija za postavljanje pozadine ovisno o kontinentu
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

