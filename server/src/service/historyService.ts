// TODO: Define a City class with name and id properties
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class City {
  city: string;
  name: string;
  id: string;

  constructor(
    city: string,
    name: string, 
    id: string
  ) 
  {
    this.city = city;
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.promises.readFile('searchHistory.json', 'utf-8');
    return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history', error);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    const data = JSON.stringify(cities, null, 2);
    await fs.promises.writeFile('searchHistory.json', data);
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.getCities();
    const newCity = new City(city, '', uuidv4());
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.getCities();
    const updatedCities = cities.filter((city: City) => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
