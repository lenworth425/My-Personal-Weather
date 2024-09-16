import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY || '';
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
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity; 
    this.wind = wind;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  constructor() {
      this.apiKey = apiKey;
      this.cityName = '';
      this.baseURL = 'https://api.openweathermap.org';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    if (!response.ok) {
      throw Error('HTTP error! status: Failed to fetch location data');
    }
    return await response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/data/2.5/forecast?q=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(query:string) {
    const response = await fetch(query);
    if (!response.ok) {
      console.error('Fetch error:', response.status, response.statusText)
      throw Error('HTTP error! status: Failed to fetch weather data');
    }
   return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { current } = response;
    const { dt, weather, temp, humidity, wind_speed } = current;
    const { description } = weather[0];
    return new Weather(
      this.cityName, 
      new Date(dt*1000).toISOString(), //help from claud AI 
      description, 
      temp, 
      humidity, 
      wind_speed);    
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((day: any) => {
      const { dt, weather, temp, humidity, wind_speed } = day;
      const { description } = weather[0];
      return new Weather(
        this.cityName, 
        new Date(dt*1000).toISOString(), //help from claud AI 
        description, 
        temp, 
        humidity, 
        wind_speed);
    });
    return [currentWeather, ...forecastArray];
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const query = this.buildWeatherQuery(coordinates);
    const weatherData = await this.fetchWeatherData(query);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData.daily);
  }
}

export default new WeatherService();
