import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import session from 'express-session'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import connectDB from './db.js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
const scholarshipsFile = path.resolve('./data/scholarships.json');
import { fileURLToPath } from 'url';

dotenv.config()
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['student', 'admin', 'hostelManager'], required: true },

  hasAppliedHostel: { type: Boolean, default: false },

  appliedHostel: { 
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' }, 
    roomType: { type: String }, 
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }
  }
});


const User = mongoose.model('User', UserSchema)

const RatingSchema = new mongoose.Schema({
  universityId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 200 },
  createdAt: { type: Date, default: Date.now }
})

const Rating = mongoose.model('Rating', RatingSchema)

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const hostelSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  universityId: { type: String, required: true },
  roomTypes: {
    twoSeater: { type: Boolean, default: false },
    threeSeater: { type: Boolean, default: false },
    fullRoom: { type: Boolean, default: false }
  },
  prices: {
    price2Seater: { type: Number },
    price3Seater: { type: Number },
    priceFullRoom: { type: Number }
  },
  ownerPhone: { type: String, required: true },

  owner: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    email: String
  },

  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },

  applications: { 
    type: [ 
      {
        applicant: {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          username: String,
          email: String
        },
        roomType: String,
        status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
        appliedAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  }
});



const Hostel = mongoose.model('Hostel', hostelSchema);

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  roomType: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.post('/signup', async (req, res) => {
  const { email, username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created', role }); 
  } catch (error) {
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
});


app.post('/signin', async (req, res) => {
  const { emailOrUsername, password } = req.body
  try {
    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    if (!user.password) return res.status(401).json({ error: 'Please login with Google OAuth' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ token, role: user.role });
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/rate', authenticateJWT, async (req, res) => {
  const { universityId, stars, comment } = req.body;
  if (!universityId || !stars) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const rating = new Rating({
      universityId,
      userId: user._id,
      username: user.username,
      stars,
      comment
    });

    await rating.save();

    res.status(201).json({ message: 'Rating saved' });
  } catch (err) {
    console.error('Error in /rate:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/ratings/:universityId', async (req, res) => {
  try {
    const ratings = await Rating.find({ universityId: req.params.universityId }).sort({ createdAt: -1 })
    res.json(ratings)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
  scope: ['profile', 'email'],
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ 
      $or: [
        { googleId: profile.id },
        { email: profile.emails[0].value }
      ]
    })
    
    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id
      })
    } else if (!user.googleId) {
      user.googleId = profile.id
      await user.save()
    }
    
    done(null, user)
  } catch (err) {
    done(err, null)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' 
  })
)

app.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/signin',
    session: false 
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.redirect(`http://localhost:5173/quiz?token=${token}`)
  }
)
app.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -googleId')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})


app.post('/contact', authenticateJWT, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,        
        pass: process.env.MAIL_PASS         
      }
    });

    const mailOptions = {
      from: user.email,
      to: 'l1s21bsse0093@ucp.edu.pk', 
      subject: 'Contact Form Submission',
      text: `Message from ${user.username} (${user.email}):\n\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});


app.post('/api/scholarships', async (req, res) => {
  const { name, type, coverage, registrationLink, validTill } = req.body;

  if (!name || !type || !coverage || !registrationLink || !validTill) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newScholarship = {
    id: Date.now().toString(),
    name,
    type,
    coverage,
    registrationLink,
    validTill,
    createdAt: new Date().toISOString()
  };

  try {
    let data = [];
    if (fs.existsSync(scholarshipsFile)) {
      const fileContent = fs.readFileSync(scholarshipsFile, 'utf-8');
      data = JSON.parse(fileContent);
    }

    data.unshift(newScholarship);
    fs.writeFileSync(scholarshipsFile, JSON.stringify(data, null, 2));
    res.status(201).json({ message: 'Scholarship added', scholarship: newScholarship });
  } catch (err) {
    console.error('Scholarship save error:', err);
    res.status(500).json({ error: 'Server error saving scholarship' });
  }
});

app.get('/api/scholarships/latest', (req, res) => {
  try {
    if (!fs.existsSync(scholarshipsFile)) return res.json(null);
    const data = JSON.parse(fs.readFileSync(scholarshipsFile, 'utf-8'));
    const latest = data.length > 0 ? data[0] : null;
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: 'Error reading scholarships' });
  }
});

app.get('/api/scholarships', (req, res) => {
  try {
    if (!fs.existsSync(scholarshipsFile)) return res.json([]);
    const data = JSON.parse(fs.readFileSync(scholarshipsFile, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scholarships' });
  }
});

//hostel
app.post('/api/hostels', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    const roomTypes = JSON.parse(req.body.roomTypes);
    const prices = JSON.parse(req.body.prices);
    const ownerPhone = req.body.ownerPhone;

    const user = await User.findById(req.user.id); 

    const newHostel = new Hostel({
      image: req.file.filename,
      name: req.body.name,
      universityId: req.body.universityId,
      roomTypes,
      prices,
      ownerPhone,
      status: "pending",
      owner: {
        userId: user._id,
        username: user.username,
        email: user.email
      }
    });

    await newHostel.save();
    res.json({ message: 'Hostel submitted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving hostel' });
  }
});


app.get('/api/hostels/unapproved', async (req, res) => {
  try {
    const unapprovedHostels = await Hostel.find({ status: 'pending' });
    res.json(unapprovedHostels);
  } catch (err) {
    res.status(500).json({ error: "Error fetching unapproved hostels" });
  }
});

app.post('/api/hostels/approve/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });

    hostel.status = 'approved';
    await hostel.save();
    res.json({ message: "Hostel approved successfully" });

  } catch (err) {
    res.status(500).json({ error: "Error approving hostel" });
  }
});

app.post('/api/hostels/decline/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });

    hostel.status = 'declined';
    await hostel.save();
    res.json({ message: "Hostel declined successfully" });

  } catch (err) {
    res.status(500).json({ error: "Error declining hostel" });
  }
});

app.get('/api/hostels/my-submissions', authenticateJWT, async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
const hostels = await Hostel.find({ "owner.userId": req.user.id.toString() });
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ error: "Error fetching hostels" });
  }
});

// hostel application
app.get('/api/hostels/approved', async (req, res) => {
  const hostels = await Hostel.find({ status: 'approved' });
  res.json(hostels);
});

app.post('/api/hostels/apply', authenticateJWT, async (req, res) => {
  try {
    const { hostelId, roomType } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.hasAppliedHostel) {
      return res.status(400).json({ error: "You have already applied to a hostel." });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    hostel.applications.push({
      applicant: {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      roomType: roomType,
      status: 'pending'
    });

    await hostel.save();

    // ✅ Update user application info
    user.hasAppliedHostel = true;
    user.appliedHostel = {
      hostelId: hostel._id,
      roomType: roomType,
      status: 'pending'
    }
    await user.save();

    res.json({ message: "Application submitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error applying for hostel" });
  }
});

app.get('/api/hostels/:id/applications', authenticateJWT, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    res.json(hostel.applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Server error fetching applications' });
  }
});

app.get('/api/hostels/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });
    res.json(hostel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching hostel" });
  }
});

app.post('/api/hostels/:hostelId/applications/:index/approve', authenticateJWT, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const index = parseInt(req.params.index);
    if (!hostel.applications[index]) return res.status(404).json({ error: "Application not found" });

    hostel.applications[index].status = 'approved';
    await hostel.save();

    res.json({ message: "Application approved successfully" });
  } catch (err) {
    console.error("Error approving:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/hostels/:hostelId/applications/:index/decline', authenticateJWT, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const index = parseInt(req.params.index);
    if (!hostel.applications[index]) return res.status(404).json({ error: "Application not found" });

    hostel.applications[index].status = 'declined';
    await hostel.save();

    res.json({ message: "Application declined successfully" });
  } catch (err) {
    console.error("Error declining:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(5000, () => console.log('Server running on port 5000'))
