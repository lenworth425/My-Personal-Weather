import { Router } from 'express';
import weatherService from '../../service/weatherService';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
const router = Router();



// TODO: POST Request with city name to retrieve weather data
router.post('/', (_req: Request, res: Response) => {
  // TODO: GET weather data from city name
  weatherService.getWeatherByCityName('cityName').then((data) => res.json(data));
  // TODO: save city to search history
  historyService.saveCity(city);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, res: Response) => {});

export default router;
