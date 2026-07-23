const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path'); 
const session = require('express-session');
const MongoStore = require('connect-mongo');
const WebSocket = require('ws');
const axios = require('axios');

const app = express();

app.use(cors({
  origin: function(origin, callback){
    return callback(null, true);
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weatherwise', // Your MongoDB connection string
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the root directory
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weatherwise')
  .then(() => {
    console.log("Connected to MongoDB locally");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  language: { type: String },
  temperature: { type: String },
  theme: { type: String },
  defaultCity: { type: String },
  savedLocations: { type: [String] },
  fontSize: { type: String },
  contrast: { type: String },
  voiceAssistance: { type: String }
});

const User = mongoose.model('User', userSchema);

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login.html'); // Redirect to login page if not authenticated
}

app.get('/', (req, res) => {
  res.send('Welcome to the Weather-Wise App!');
});

app.post('/signup', async (req, res) => {
  const { name, email, password, username } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }

    // Create a new user
    const newUser = new User({ name, email, password, username });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      req.session.userId = user._id; // Store user ID in session
      res.sendFile(path.join(__dirname, 'homepage.html'));
    } else {
      res.status(401).json({ error: "Incorrect email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

app.get('/home', isAuthenticated, (req, res) => {
  res.send('Welcome to your personalized Weather-Wise homepage!');
});

app.get('/signout', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/forcast.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'forcast.html'));
});

app.get('/alerts.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'alerts.html'));
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Error logging out" });
    }
    res.redirect('/'); // Redirect to homepage or login page
  });
});

// Check session route
app.get('/check-session', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Settings route
app.post('/settings', async (req, res) => {
  const {
    language,
    temperature,
    theme,
    defaultCity,
    savedLocations,
    fontSize,
    contrast,
    voiceAssistance
  } = req.body;

  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (user) {
      user.language = language;
      user.temperature = temperature;
      user.theme = theme;
      user.defaultCity = defaultCity;
      user.savedLocations = savedLocations;
      user.fontSize = fontSize;
      user.contrast = contrast;
      user.voiceAssistance = voiceAssistance;
      await user.save();
    

      res.json({ message: "Settings updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating settings" });
  }
});

// Serve the WebSocket test page
app.get('/websocket-test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'websocket-test.html'));
});

// Update user details
app.put('/user/:id', async (req, res) => {
  console.log('Received PUT request for user ID:', req.params.id);
  console.log('Request body:', req.body);
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: "User not found" });
    }
    console.log('User updated:', user);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: "Error updating user" });
  }
});

// Delete user
app.delete('/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Export the server for testing
module.exports = server;

// Create a WebSocket server on the same port as your HTTP server
const wss = new WebSocket.Server({ server });

// Function to fetch weather data
async function fetchWeatherData(city) {
    const apiKey = '0ab13fdbba1599dda116f576fa9511f6'; // Replace with your API key
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Broadcast weather updates to all clients
async function broadcastWeatherUpdates(city) {
    const weatherData = await fetchWeatherData(city);
    const message = JSON.stringify(weatherData);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received message:', data);

            if (data.type === 'faq') {
                // Handle FAQ question
                const response = await handleFAQ(data.question);
                ws.send(JSON.stringify({ type: 'faq', response }));
            } else if (data.city) {
                // Handle weather request
                console.log(`Fetching weather for city: ${data.city}`);
                const weatherData = await fetchWeatherData(data.city);
                const weatherMessage = `Current weather in ${weatherData.name}: ${weatherData.weather[0].description}, ${weatherData.main.temp}°C`;
                console.log(weatherMessage);
                ws.send(weatherMessage);
            } else {
                console.error('City name is undefined');
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

async function handleFAQ(question) {
    // Simple FAQ logic (you can expand this)
    const faqs = {
        "What is the weather app?": "This app provides real-time weather updates.",
        "How do I use the app?": "Enter a city name to get the weather forecast.",
        "What data sources do you use?": "We use the OpenWeather API for weather data."
    };

    return faqs[question] || "Sorry, I don't have an answer for that.";
}

console.log('WebSocket server is running on ws://localhost:3001');
