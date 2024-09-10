import dotenv from 'dotenv';
dotenv.config();

const apikey = 06370a6f4e2c62beed5a0e027339f568;
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public date: string,
    public description: string,
    public temp: number,
    public humidity: number,
    public wind: number
  ) {
    
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string; 
  constructor() {
    this.baseURL = 'api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}';
    this.apiKey = process
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const locationData = await response.json();
    return locationData;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const weatherData = await response.json();
    return weatherData;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { current } = response;
    const { dt, weather, temp, humidity, wind_speed } = current;
    const { description } = weather[0];
    return new Weather(this.cityName, dt, description, temp, humidity, wind_speed);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((day: any) => {
      const { dt, weather, temp, humidity, wind_speed } = day;
      const { description } = weather[0];
      return new Weather(this.cityName, dt, description, temp, humidity, wind_speed);
    });
    forecastArray.unshift(currentWeather);
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
    return forecastArray;
  }
}

export default new WeatherService();
