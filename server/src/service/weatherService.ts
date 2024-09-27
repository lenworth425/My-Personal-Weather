import dotenv from 'dotenv';
import { Dayjs } from 'dayjs';

dotenv.config();

const apiKey = process.env.API_KEY || '';
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
interface IWeather {
  city: string;
  date: Dayjs | string; // you can use dayjs or just a string delete it if you do not
  tempF: number;
  windSpeed: number; //response.wind.speed,
  humidity: number;
  icon: string;
  iconDescription: string;
  }
class Weather implements IWeather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;

  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}
// TODO: Complete the WeatherService class
interface IWeatherService {
  baseURL: string;
  apiKey: string;
  city: string;
  date: string;
  temp: number;
  iconDescription: string;
  getWeatherForCity(city: string): Promise<Weather[]>;
}
class WeatherService implements IWeatherService {
  // TODO: Define the baseURL, API key, and city name properties
baseURL: string;
apiKey: string;
city: string;
date: string;
temp: number;
icon: string;
iconDescription: string;
windSpeed: number;
humidity: number;
constructor() {
  this.baseURL = 'https://api.openweathermap.org/data/2.5/';
  this.apiKey = apiKey;
  this.city = '';
  this.date = '';
  this.temp = 0;
  this.icon = '';
  this.iconDescription = '';
  this.windSpeed = 0;
  this.humidity = 0;
}
  
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    
    try {
      const response = await fetch(query);
      if (!response.ok) {
        console.error('Error fetching location data:', response.statusText);
        return null;
      }
      
    return await response.json();
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
}
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const coordinates: Coordinates = {
      lat: locationData.lat,
      lon: locationData.lon,
    };
    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=1&appid=${apiKey}&units=imperial`;
    return url;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coord: Coordinates): string {
    this.buildGeocodeQuery();
    return `${this.baseURL}weather?lat=${coord.lat}&lon=${coord.lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    
      
    if (locationData === null) {
      return { lat: 25.7743, lon: -80.1937 };
    }
  
    return this.destructureLocationData(locationData[0]);
  }
    
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
   
    try {
      const response = await fetch(query);
      if (!response.ok) {
        console.error('Error fetching weather data:', response.statusText);
        return null;
      }
      const data = await response.json();
    
      if (!data || !data.main || !data.weather) {
        console.error('Invalid weather data:', data);
        return null;
      }
      return data;

    } catch (error) {
      console.error('Error fetching weather data:', error)
      return null;
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const currentWeather = new Weather(
      response.city,
      response.date,
      response.main.tempF,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description         
    );
    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [];
    for (let i = 0; i < [].length; i++) {
      const forecast = new Weather(
        currentWeather.city,
        weatherData[i].date,
        weatherData[i].tempF,
        weatherData[i].windSpeed,
        weatherData[i].humidity,
        weatherData[i].icon,
        weatherData[i].iconDescription
      );
      forecastArray.push(forecast);
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
    async getWeatherForCity(_city: string): Promise<Weather[]> {
    const url = `${this.baseURL}forecast?q=${_city}&appid=${this.apiKey}&units=imperial`;
    this.city = _city;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod !== '200') {
        console.error(`Error fetching weather data: ${data.message}`);
        return [];
      }

      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
      const weatherList = data.list.filter((item: any) => item.dt_txt.includes('12:00:00')
        ); 

      return [forecastArray, currentWeather, weatherList.map((item: any) => new Weather(
        item.name,
        new Date(item.dt * 1000).toLocaleDateString(),
        item.main.temp,
        item.wind.speed,
        item.main.humidity,
        item.weather[0].icon,
        item.weather[0].description
      ))];
            
    } catch (error) {
      console.error(`Error fetching weather data: ${error}`);
      return [];
    }
  }
}

export default new WeatherService();
