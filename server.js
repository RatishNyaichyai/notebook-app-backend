const express = require('express');
const mongoose = require('mongoose');
require('./database');
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

const cors = require('cors');
// app.use(cors({
//     origin: [
//         'http://localhost:3000', 'https://notebook-app-frontend.onrender.com/'
//     ]
// }));
app.use(cors());

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe'

const uri = 'mongodb+srv://Ratish:frznheart20@cluster0.c7skkwb.mongodb.net/?retryWrites=true&w=majority';

mongoose
    .connect(uri, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('Connected to database');
    })
    .catch((e) => console.log(e));


const User = mongoose.model('UserInfo')

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send({ error: "User Exists!!" });
        }

        await User.create({
            name,
            email,
            password: encryptedPassword,
        });
        res.send({ status: 'ok' });

    } catch (error) {
        res.send({ status: 'error' });

    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ error: 'User Not Found' });

    }
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, JWT_SECRET)

        if (res.status(201)) {
            return res.json({ status: 'ok', data: token });
        } else {
            return res.json({ error: 'error' });
        }
    }
    res.json({ status: 'error', error: 'Invalid Password' });
})

app.listen(PORT || 5000, () => {
    console.log('Server Started');
})