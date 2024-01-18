const router = express.Router();

router.get('/getMovies', mainPageController.getMovies);

router.get('/getSeries', mainPageController.getSeries);