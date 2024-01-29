import fs from 'fs';

const getRootHandler = (req, res) => {
    try {
        fs.readFile('./index.html', 'utf8', (err, data) => {
            if (err) {
                res.send('Error while reading file');
            } else {
                res.send(data);
            }
        });
    } catch (err) {
        console.log(err);
    }
};

export { getRootHandler };
