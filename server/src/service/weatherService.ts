import dotenv from 'dotenv';
import { Dayjs } from 'dayjs';
import { error } from 'console';
dotenv.config();

// TODO: Define an interface for the Coordinates object (if you use the GEO API you are not required to)
const apiKey = process.env.API_KEY || '';

interface IWeather {
  city: string;
  date: Dayjs | string; // you can use dayjs or just a string delete it if you do not
  tempF: number;
  windSpeed: number; //response.wind.speed,
  humidity: number;
  icon: string;
  iconDescription: string;
  }
// TODO: Define a class for the Weather object
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

interface IWeatherService {
  date: string;
  temperature: number;
  description: string;
  getWeatherForCity(city: string): Promise<Weather[]>; // this is an async function
}
// TODO: Complete the WeatherService class
class WeatherService implements IWeatherService {
  baseUrl: string;
  apiKey: string;
  cityName: string;
  date: string;
  temperature: number;
  description: string;

  constructor(apiKey: string) {
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    this.apiKey = apiKey;
    this.cityName = 'Orlando';
    this.date = '';
    this.temperature = 0;
    this.description = '';
  }
  

  async getWeatherForCity(_city: string): Promise<Weather[]> {
    const url = `${this.baseUrl}?q=${_city}&appid=${this.apiKey}`;
    console.log('url', url);
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.cod !== '200') {
        console.error(`Error fetching weather data: ${data.message}`, error);
        return [];
      }
      console.log('Getting weather for city:', _city);
      
      // Filter the data to get the next 5 days
      let weatherList = data.list.filter((item: any) => {
        return item.dt_txt.includes('12:00:00');
      });
      
      // weatherList = weatherList.map((item: any) => new Weather(
      //     _city,
      //     new Date(item.dt * 1000).toLocaleDateString(),
      //     Math.round(item.main.temp - 273.15) * 9/5 + 32 ,
      //     item.wind.speed,
      //     item.main.humidity,
      //     item.weather[0].icon,
      //     item.weather[0].description
      //   ));
      //   let currentWeather = weatherList[0];
      //   return [weatherList, currentWeather];

      //Map the API data to your Weather class
      return weatherList.map((item: any) => new Weather(
        _city,
        new Date(item.dt * 1000).toLocaleDateString(),
        Math.round(item.main.temp - 273.15) * 9/5 + 32 ,
        item.wind.speed,
        item.main.humidity,
        item.weather[0].icon,
        item.weather[0].description
      ));
    }
    catch (error) {
      console.error('Error getting weather data', error);
      return [];
    }
  }
}

export default new WeatherService(apiKey);
