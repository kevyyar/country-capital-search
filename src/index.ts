const searchForm = document.getElementById("search") as HTMLFormElement;
const countryResults = document.getElementById(
  "country-results"
) as HTMLDivElement;
const searchInput = document.getElementById(
  "search-country"
) as HTMLInputElement;

interface Country {
  name: {
    common: string;
  };
  capital: string;
  region: string;
  flag: string;
  currencies: {
    [code: string]: {
      name: string;
      symbol: string;
    };
  };
}

function createCountryElement(country: Country): HTMLDivElement {
  const countryElement = document.createElement("div");
  const nameElement = document.createElement("p");
  const capitalElement = document.createElement("p");
  const countryFlag = document.createElement("span");
  nameElement.textContent = `${country.name.common} -  `;
  capitalElement.textContent = country.capital;
  countryFlag.textContent = country.flag;
  countryElement.appendChild(nameElement);
  countryElement.appendChild(capitalElement);
  countryElement.appendChild(countryFlag);
  return countryElement;
}

function renderCountries(countries: Country[]): void {
  if (countries.length === 0) {
    countryResults.innerHTML = "No country found";
  } else {
    countryResults.innerHTML = "";
    countries.forEach((country) => {
      const countryElement = createCountryElement(country);
      countryResults.appendChild(countryElement);
    });
  }
}

async function listCountries(name: string): Promise<Country[]> {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    if (!res.ok) {
      throw new Error(`HTTP Error! Failed to fetch country: ${res.statusText}`);
    }
    const data = (await res.json()) as Country[];
    console.log(data);
    const filteredData = data.filter((country) =>
      country.name.common.toLowerCase().includes(name.toLowerCase())
    );
    return filteredData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

let timeoutId: ReturnType<typeof setTimeout>;

searchInput.addEventListener("input", async () => {
  const inputValue = searchInput.value;
  clearTimeout(timeoutId);
  if (inputValue.length >= 3) {
    timeoutId = setTimeout(async () => {
      const countries = await listCountries(inputValue);
      renderCountries(countries);
    }, 500);
  } else {
    countryResults.innerHTML = "";
  }
});
