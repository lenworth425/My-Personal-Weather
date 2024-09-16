import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
const router = Router();



// TODO: POST Request with city name to retrieve weather data
router.post('/', (_req, res) => {
  const city = _req.body.city;
   // TODO: GET weather data from city name
  WeatherService.getWeatherForCity(city).then((data) => res.json(data));
  // TODO: save city to search history
   HistoryService.addCity(city);
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req, res) => {
  const id = _req.params.id;
  await HistoryService.removeCity(id);
  res.json({ message: 'City removed from history' });
});

export default router;
