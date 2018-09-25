const formidable = require('formidable');
const path = require('path');

module.exports = function (express, app, db) {
    const angular_path = path.join(__dirname, '../angular/dist/angular');
    app.use(express.static(angular_path.toString()));
    app.use('/uploads', express.static(path.join(__dirname, './uploads')));
    app.post('/get_user', (req, res) => {
        const username = req.body.username;
        if (username === undefined) {
            db.collection('users').find({}).toArray((err, result) => {
                if (err) { res.json(undefined); return;}
                res.json(result);
            });
            return;
        }

        db.collection('users').find({ username: { $regex: new RegExp('^' + username, 'i') } }).toArray((err, result) => {
            if (err) { res.json(undefined); return; }
            res.json(result);
        });
    });

    app.post('/add_user', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        let avatar = req.body.avatar;
        if (avatar == null || avatar === undefined || avatar === '') { avatar = 'https://via.placeholder.com/256x256'}

        db.collection('users').insertOne({ username: username, password: password, avatar: avatar }).then((result) => {
            res.json(true);
        }, (err) => {
            res.json(false);
        });
    });

    app.post('/set_user', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const avatar = req.body.avatar;

        db.collection('users').update({ username: username }, { username: username, password: password, avatar: avatar });
        res.json({ success: true });
    });

    app.post('/get_messages', (req, res) => {
        let limit = req.body.limit;
        if (limit === undefined) { limit = 20; }
        if (limit === -1) {
            db.collection('messages').find({}).sort({ timestamp: 1 }).toArray((err, result) => {
                if (err) { res.json(undefined); return; }
                res.json(result);
            });
            return;
        }

        db.collection('messages').find({}).sort({ timestamp: -1 }).limit(limit).toArray((err, result) => {
            if (err) { res.json(undefined); return; }
            res.json(result);
        });
    });

    app.post('/upload', (req, res) => {
        const form = new formidable.IncomingForm({ uploadDir: './uploads' });
        form.keepExtensions = true;

        form.on('error', function (err) {
            res.send({ success: false, error: err });
            throw err;
        });

        let formidableFilePath = '';

        form.on('fileBegin', function(name, file) {
            // Nope, we're making it random to prevent conflicts.
            formidableFilePath = file.path;
            // file.path = form.uploadDir + '/' + file.name;
        });

        form.on('file', function(field, file) {
            res.send({ success: true, size: file.size, url: "/" + formidableFilePath.replace('\\', '/') });
        });

        form.parse(req);
    });

    app.get('*', (req, res) => {
        console.log('GET ' + req.path);
        console.log(req.parameters);
        res.send(req.path);
    });

    app.post('*', (req, res) => {
        console.log('POST ' + req.path);
        console.log(req.body);
        res.send(req.path);
    });

    console.log('Routes setup complete!');
};