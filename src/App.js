import './App.css';
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core"
import React, { useState, useEffect } from 'react';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table.js"
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {

  // STATE = How to write a variable in react
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat:34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState(["cases"]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    });
  }, [])

  // USEEFFECT = Runs a piece of code based on a given condition
  useEffect(() => {
    // Empty = The code inside here will run once when the component loads and not again 
    // Otherwise when the country variable change it will run

    // Async = send a req, wait for it, do something with info

    const getCountriesData = async() => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,   
            value: country.countryInfo.iso2 
        }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      })
    }

    getCountriesData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value

    const url = countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;


    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);

      // All of the data from the country response
      setCountryInfo(data);

      setMapCenter(countryCode ==="worldwide" ? {lat: 34.80746, lng: -40.4796} : [data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(countryCode === "worldwide" ? 2.5 : 4);
      console.log(data);
    })
  }; 

  return (

    // Header 
    // Title + select input dropdown field
    <div className="app">
      <div className="app__left">

        <div className="app__header">
          <h1>COVID 19 Tracker</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox isRed active={casesType === "cases"} onClick={(e) => setCasesType('cases')} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>

          <InfoBox active={casesType === "recovered"} onClick={(e) => setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>

          <InfoBox isOrange active={casesType === "deaths"} onClick={(e) => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>

        {/* Map */}
        <Map 
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>

      <Card className="app__right">
        <CardContent> 
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">WorldWide new {casesType}</h3>
            {/* Graph */}
            <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
