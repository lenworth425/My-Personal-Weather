import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
const router = Router();



// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const city = req.body.city;
    // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city)
    console.log('received city', city);
    await HistoryService.addCity(city);
    // TODO: save city to search history
    res.json(weatherData);
  } catch (error) {
    console.error('Error getting weather data', error);
    res.status(500).json({ message: 'An error occurred while retrieving the search history' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
  res.json(cities);
  } catch (error) {
    console.error('Error getting search history', error);
    res.status(500).json({ message: 'An error occurred while retrieving the search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req, res) => {
  try {
  const id = _req.params.id;
  await HistoryService.removeCity(id);
  res.json({ message: 'City removed from history' });
  } catch (error) {
    console.error('Error removing city from history', error);
    res.status(500).json({ message: 'An error occurred while removing the city from the search history' });
  }
});

export default router;
