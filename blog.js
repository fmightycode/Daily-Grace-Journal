require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose").default;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const axios = require("axios");
async function sendNotification(title, message) {
  try {
    await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ["All"],
        headings: { en: title },
        contents: { en: message }
      },
      {
        headers: {
          Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Notification sent");
  } catch (err) {
    console.error("❌ Notification error:", err.response?.data || err.message);
  }
}
const homeContent = `Daily Grace Journal is a quiet space created for believers who desire to walk closely with God in their everyday lives. In a world filled with noise and distractions, this journal exists to help you pause, reflect, and reconnect with God’s Word in a meaningful way.
Our heart is to encourage a daily rhythm of devotion—one that is honest, reflective, and deeply rooted in Scripture. Whether you are beginning your faith journey or have walked with Christ for many years, you will find words here that speak gently to your spirit and strengthen your walk.
Each devotional is written to guide you into moments of stillness, helping you meditate on God’s truth and apply it practically to your life. These reflections are not meant to rush you, but to invite you into a slower, deeper encounter with God’s presence.
The journal section is a personal space where thoughts, prayers, and lessons from Scripture come together. Writing is a powerful way to hear God more clearly, and this platform encourages you to record your faith journey—both the victories and the struggles—knowing that God is present in every season.
Scripture is at the center of everything we share. Here, the Bible is not just read but reflected upon, allowing God’s Word to shape hearts, renew minds, and guide daily decisions with wisdom and grace.
Above all, Daily Grace Journal is a reminder that God’s mercy is new every morning. No matter where you are today, you are welcome here—to read, to reflect, and to grow in faith, one day at a time.`

const devotional=`Daily Devotionals are created to help believers begin each day focused on God. They provide gentle guidance through scripture and reflection.
Each devotional invites stillness. In these moments, believers are encouraged to pause, breathe, and listen to God’s voice.
Scripture is the foundation of every devotional. God’s Word provides truth, wisdom, and comfort for daily living.
These devotionals are intentionally unhurried. They encourage thoughtful reading rather than rushing through spiritual time.
Through reflection, believers learn to apply scripture practically. Faith becomes something lived, not just read.
Daily devotion builds spiritual consistency. Even short moments with God can shape an entire day.
These devotionals are written to encourage trust in God’s promises. They remind readers that God is present in every circumstance.
Prayer is woven throughout each devotional. It invites conversation with God rather than one-sided reading.
As devotion becomes habit, faith deepens naturally. Over time, hearts are shaped by God’s truth.
Prayer: Lord, thank You for Your Word that guides and sustains us. Help us to seek You daily with open hearts and attentive spirits. May Your truth shape our thoughts and actions. Amen.`

const about =`Daily Grace Journal was created from a desire to slow down and make room for God in everyday life. What began as a personal habit of journaling and prayer gradually became a shared space for faith and reflection.
In a world that often feels rushed and overwhelming, we believe God invites us into moments of stillness. Writing helps us notice His presence more clearly and hear His voice more intentionally.
This journal exists to support believers who long for depth in their spiritual walk. It is a place for reflection, honesty, and growth rooted in God’s Word.
Our story is shaped by seasons of joy, waiting, and learning. Through every chapter, we have discovered that God remains faithful and present.
We believe faith is not about perfection but persistence. Journaling allows believers to return to God again and again, even in moments of uncertainty.
Through devotionals, reflections, and scripture, we seek to point hearts back to Christ. Every word is written with prayer and purpose.
Community matters deeply to us. Faith grows stronger when shared, and this journal invites believers to walk together in encouragement and love.
We value authenticity and humility. Our content reflects real experiences and honest faith, trusting God through both clarity and confusion.
As this journal continues to grow, our hope remains the same—to create a peaceful space where God’s Word leads and grace abounds.
`
const prayer =`Prayer is a sacred conversation with God. It is where hearts are opened, burdens are lifted, and faith is strengthened through honest communication with Him.
In prayer, we come before God just as we are. There is no need for perfect words—only a willing and humble heart that seeks His presence.
This prayer space is created to help believers slow down and focus on God. It invites moments of stillness in a busy and noisy world.
Prayer connects us to God’s peace. When worries feel overwhelming, prayer becomes a place of rest and reassurance in His promises.
Through prayer, we learn to trust God more deeply. It reminds us that we are not alone and that God listens attentively to every cry of the heart.
Prayer also teaches patience. Sometimes answers come quickly, and other times God works quietly over time, shaping our hearts in the waiting.
Here, prayer is encouraged as a daily habit, not only in moments of need but also in moments of gratitude and praise.
Intercessory prayer is powerful. Lifting others before God strengthens community and reflects Christ’s love in action.
This space welcomes personal prayers, silent reflection, and written conversations with God. Every prayer offered here matters.
As you pray, allow God’s presence to calm your spirit and renew your strength. Trust that He hears you and is working for your good.
Prayer: Heavenly Father, thank You for inviting us into relationship with You. Teach us to pray with faith, patience, and trust. Quiet our hearts, guide our thoughts, and draw us closer to You each day. May our lives reflect Your love and grace. In Jesus’ name, Amen.`

const contact =`Daily Grace Journal is built on connection and community. Every message shared strengthens the bond between believers.
We welcome questions, feedback, and encouragement. Your voice matters here.
Prayer requests are especially meaningful. Standing together in prayer reminds us of God’s power and compassion.
Sharing testimonies encourages faith. Your story may be exactly what someone else needs to hear.
Communication builds trust and understanding. Each message is received with care and respect.
This journal is a shared space, not a distant platform. We value personal connection deeply.
Faith grows when believers support one another. Reaching out is an act of courage and trust.
We believe God works through community. Conversations can bring healing and hope.
Thank you for being part of this journey. Your presence enriches this space. Whatsapp contact: 08164355099 or Click any of the social handles on the footer`

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("public")));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("bufferCommands", false);

const PORT = process.env.PORT || 10000;

// DATABASE
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 120000,
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});

// SCHEMAS
const userSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  googleId: String,
  githubId: String,
  feedback: String,
  isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("Users", userSchema);

const Home = mongoose.model("Home", new mongoose.Schema({
  postday: String,
  postitle: String,
  postcontent: String
}));

const Pray = mongoose.model("Pray", new mongoose.Schema({
  postday: String,
  postitle: String,
  postcontent: String
}));

const Devotion = mongoose.model("Devotion", new mongoose.Schema({
  postday: String,
  postitle: String,
  postcontent: String
}));

// PASSPORT
passport.use(User.createStrategy());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user)).catch(err => done(err));
});

// AUTH MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) return next();
  res.status(403).send("Access Denied");
}

// ROUTES
app.get("/", (req, res) => res.render("signup"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/privacy", (req, res) => res.render("privacy"));
app.get("/terms", (req, res) => res.render("terms"));
app.get("/feedback", (req, res) => res.render("feedback"));

app.get("/home", isLoggedIn, async (req, res) => {
  try {
    const foundList = await Home.find();
    return res.render("home", { homecontent: "content", post: foundList });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error loading home");
  }
});

app.get("/devotional", isLoggedIn, async (req, res) => {
  try {
    const foundList = await Devotion.find();
    return res.render("devotional", { devocontent: "content", post: foundList });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error loading devotional");
  }
});

app.get("/prayer", isLoggedIn, async (req, res) => {
  try {
    const foundList = await Pray.find();
    return res.render("prayer", { prayerContent: "content", post: foundList });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error loading prayer");
  }
});

app.get("/about", async (req, res) => {
  try {
    const foundUser = await User.find({ feedback: { $ne: null } });
    return res.render("about", { aboutcontent: "content", userFeedback: foundUser });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error loading about");
  }
});

// FIXED DYNAMIC ROUTE
app.get("/post/:postName", isLoggedIn, async (req, res) => {
  try {
    const foundList = await Home.find();
    const postSend = foundList.find(p => p.postitle === req.params.postName);

    if (!postSend) return res.redirect("/home");

    return res.render("server", { post: postSend });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Error loading post");
  }
});

// POST ROUTES
app.post("/feedback", isAdmin, async (req, res) => {
  try {
    const submitFeedback = req.body.message;
    const user = await User.findById(req.user.id);
    user.feedback = submitFeedback;
    await user.save();
    res.redirect("/about");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving feedback");
  }
});

app.post("/post", async (req, res) => {
  try {
    const home = new Home({
      postday: _.toUpper(req.body.postDay),
      postitle: req.body.postTitle,
      postcontent: req.body.postContent
    });

    await home.save();

    // FIXED: no await
    sendNotification("📖 New Post", home.postitle);

    res.redirect("/home");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error posting");
  }
});

// LOGIN
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, err => {
    if (err) return res.redirect("/login");
    passport.authenticate("local")(req, res, () => res.redirect("/home"));
  });
});

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      fullname: req.body.fullname
    });

    await User.register(user, req.body.password);
    passport.authenticate("local")(req, res, () => res.redirect("/home"));

  } catch (err) {
    console.error(err);
    res.redirect("/register");
  }
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).send("Page not found");
});