const express = require("express");
const router = express.Router();
const usercontroller = require('../controllers/usercontroller')

router.get('/', usercontroller.admin);

router.get('/home',usercontroller.home);

router.get('/register',usercontroller.register);
router.post('/register',usercontroller.registration);

router.get('/login',usercontroller.login);
router.post('/login',usercontroller.loggingIn);


router.get('/team',usercontroller.viewteam);
router.get('/umpire',usercontroller.viewumpire);
router.get('/score', usercontroller.viewscore);
router.get('/match_details',usercontroller.viewmatch);
router.get('/teamplayers/:team_id', usercontroller.viewteamplayers);
//router.post('/teamplayers', usercontroller.find);
router.get('/batsmen', usercontroller.viewbatsmen);
router.get('/bowler', usercontroller.viewbowler);

router.get('/allrounder', usercontroller.allrounder);
router.get('/admin', usercontroller.admin);
router.get('/admin_team', usercontroller.admin_team);
router.get('/admin_player/:team_id', usercontroller.admin_player);

router.get('/edit_player/:player_id', usercontroller.edit_player);
router.post('/edit_player/:player_id', usercontroller.update_player);
//router.get('/update_player',usercontroller.updating)

router.get('/add_players',usercontroller.form);
router.post('/add_players',usercontroller.add_players);

router.post('/delete',usercontroller.delete);











module.exports = router;