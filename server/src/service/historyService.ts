// TODO: Define a City class with name and id properties
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class City {
  name: string;
  id: string;

  constructor(
    name: string, 
    id: string
  ) 
  {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.promises.readFile('db/db.json', 'utf-8');
    return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history', error);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    const data = JSON.stringify(cities, null, 2);
    await fs.promises.writeFile('db/db.json', data);
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(name: string) {
    const cities = await this.getCities();
    const newCity = new City(name, uuidv4());
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
