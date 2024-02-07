class mainController {
    getMain(req, res) {
        res.render('index', {
            title: 'Main',
        });
    }
}

export default new mainController();
