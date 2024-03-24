require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const authenticateToken = require('./middlewares/authMiddleware.js'); 
const bcrypt = require('bcrypt');
const app = express();
const conn = require('./db.js');
const Problem = require('./model/problem.model.js');
const user = require('./model/user.model.js'); 
const bodyParser = require('body-parser');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    conn();
    console.log(`Server is running on port ${PORT}`);
});


// routing for products
// app.use('api/problems', problems)

// route for getting all problems
app.get('/getproblems', async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// route for adding a problem
app.post('/problems', async (req, res) => {
    try {
        const problem = await Problem.create(req.body);
        res.status(200).json(problem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// route for deleting a problem
app.delete('/problems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problem.findByIdAndDelete(id);

        if(!product){
            return res.status(404).json({message : "product not found"});
        }
        res.status(200).json({message : "product deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// route for getting all users
app.get('/users', (req, res) => {
    try {
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// route for the home page
app.get('/', (req, res) => {
    res.send('Welcome to the home page');
});

// route for the protected page
app.get('/protected', authenticateToken, (req, res) => {
    res.send('Welcome to the protected page');
});

// route for login 
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userss = await user.findOne({ username });

        // checking whether the user exists or not  
        if (!userss) {
            return res.status(400).json({ error: 'User does not exist' });
        }
        // if user exists then check for hashed password
        const validPassword = await bcrypt.compare(password, userss.password);
        if(!validPassword){
            return res.status(400).json({ error: 'Invalid Password' });
        }

        const accessToken = jwt.sign({ id: userss._id }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken: accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// route for register user
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // print the user details
        console.log(req.body);
        // check if the user already exists
        if(!username || !email || !password){
            return res.status(400).json({ error: 'Invalid input' });
        }
        const existingUser = await user.findOne({ username });
        if(existingUser){
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ username, email, password: hashedPassword });
        console.log('New User:', newUser);
        await newUser.save();
        
        // use jwt to create a token for the user
        const accessToken = jwt.sign({ id: newUser._id },      process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken: accessToken, message: 'User registered  successfully' }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});