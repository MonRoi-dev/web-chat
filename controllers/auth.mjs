class authController {
    getLog(req, res) {
        res.render('login', {
            title: 'Log In',
        });
    }

    getReg(req, res) {
        res.render('regin', {
            title: 'Registration',
        });
    }
}

export default new authController();
