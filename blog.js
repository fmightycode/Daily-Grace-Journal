
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const path = require("path");
const app = express();
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");
const { MissingUsernameError } = require("passport-local-mongoose/dist/lib/errors");
const passportLocalMongoose = require("passport-local-mongoose").default;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const findOrCreate = require("mongoose-findorcreate");
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

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join("public")));
app.use(express.json());

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));

app.use(session({ 
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("bufferCommands", false);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
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
const userSchema = new mongoose.Schema({ 
    fullname: String,
    username: String,
    googleId: String,
    githubId: String,
    feedback: String,
    isAdmin: { 
        type: Boolean,
        default: false
    },
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("Users", userSchema);

const homeSchema = new mongoose.Schema({ 
    postday: String,
    postitle: String,
    postcontent: String
});

const Home = mongoose.model("Home", homeSchema);

const praySchema = new mongoose.Schema({ 
    postday: String,
    postitle: String,
    postcontent: String
});

const Pray = mongoose.model("Pray", praySchema);

const devotionSchema = new mongoose.Schema({ 
    postday: String,
    postitle: String,
    postcontent: String
});

const Devotion = mongoose.model("Devotion", devotionSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});

if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
  const GoogleStrategy = require("passport-google-oauth20").Strategy;

  passport.use(new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://daily-grace-journal.onrender.com/auth/google/home",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        { googleId: profile.id },
        {
          username: profile.emails?.[0]?.value,
          fullname: profile.displayName
        },
        cb
      );
    }
  ));

  app.get("/auth/google", passport.authenticate("google", { scope: ["openid", "profile", "email"] }));

  app.get("/auth/google/home", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) { 
      res.redirect("/signup"); 
    }
  );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET && process.env.GIT_URL) {
  const GitHubStrategy = require("passport-github2").Strategy;

  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: process.env.GIT_URL
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        { githubId: profile.id },
        {
          username: profile.emails?.[0]?.value,
          fullname: profile.displayName || profile.username
        },
        cb
      );
    }
  ));

  app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

  app.get("/auth/github/home", 
    passport.authenticate("github", { failureRedirect: "/login" }),
    function(req, res) { 
      res.redirect("/signup"); 
    }
  );
}

app.get("/", function(req, res){   
    res.render("signup")
})
app.get("/register", function(req, res){ 
    res.render("register")
})
app.get("/login", function(req, res){ 
    res.render("login")
})

app.get("/contact", isLoggedIn, (req, res) =>{ 
    res.render("contact", {contactcontent: contact})
});

app.get("/about", async(req, res) =>{ 
    try {
        const foundUser = await User.find({"feedback": {$ne: null}});
        if (!foundUser){ 
            console.log("User not found")
        } 
        res.render("about", {aboutcontent: about, userFeedback: foundUser});
    } catch (error) {
       console.error(error);
    }
});

app.get("/post", isAdmin, (req, res) =>{ 
    res.render("post");
});

app.get("/logout", function(req, res){ 
    req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/login");
  });
});

app.get("/privacy", function(req, res){
  res.render("privacy");
});

app.get("/terms", function(req, res){
  res.render("terms");
});

app.get("/feedback", (req, res) => {
  res.render("feedback");
});


app.post("/feedback", isAdmin, async(req, res) => {
        submitFeedback = req.body.message;
        console.log(req.user)
    try {
        const foundUser = await User.findById(req.user.id);
        if (!foundUser){ 
            console.log("User doesn't exist")
        }
        foundUser.feedback = submitFeedback;
        await foundUser.save();
        res.redirect("/about")

    } catch (error) {
        console.error(error);
    }
});

app.get("/home", isLoggedIn, async(req, res) =>{ 
     try {
        const foundList = await Home.find();
        if (foundList.length === 0){ 
           res.render("home", {homecontent: homeContent, post: foundList})
        }
        else{ 
           res.render("home", {homecontent: homeContent, post: foundList})
        }
    } catch (err) {
        console.error(err)
    }
});

app.get("/devotional", isLoggedIn, async(req, res) =>{ 
     try {
        const foundList = await Devotion.find();
        if (foundList.length === 0){ 
           res.render("devotional", {devocontent: devotional, post: foundList})
        }
        else{ 
           res.render("devotional", {devocontent: devotional, post: foundList})
        }
    } catch (err) {
        console.error(err)
    }
});

app.get("/prayer", isLoggedIn, async(req, res) =>{ 
     try {
        const foundList = await Pray.find();
        if (foundList.length === 0){ 
           res.render("prayer", {prayerContent: prayer, post: foundList})
        }
        else{ 
           res.render("prayer", {prayerContent: prayer, post: foundList})
        }
    } catch (err) {
        console.error(err)
    }
});

function isLoggedIn(req, res, next){ 
    if (req.isAuthenticated()){ 
        return next();
    }
    res.redirect("/login")
}

function isAdmin(req, res, next){
    if (req.isAuthenticated() && req.user.isAdmin){ 
        return next()
    }
    else {
        res.status(403).send("Access Denied")
}
}

app.post("/register", async(req, res) => {
    try {
         if (!req.body.agree) {
      return res.redirect("/register");
    }
        const user = new User ({ 
            username: req.body.username,
            fullname: req.body.fullname
        });
        await User.register(user, req.body.password);
        passport.authenticate("local")(req, res, function(){ 
            res.redirect("/home")
        });
        
    } catch (error) {
        console.error(error);
        res.redirect("/register");
    }
});

app.post("/login", async(req, res) =>{ 
    try {
        const user = new User({ 
            username: req.body.username,
            password: req.body.password
        });   
        req.login(user, function(err){ 
            if (!err){
                passport.authenticate("local")(req, res, function(){ 
                res.redirect("/home");
            });
            } else{ 
                res.redirect("/login");
            }
        });
    } catch (error) {
        console.error(error, "Sign up first");
    }
});

app.post("/post", async(req, res) =>{ 
    const postSection = _.capitalize(req.body.postSection);
    const home = new Home ({
        postday: _.toUpper(req.body.postDay),
        postitle: _.capitalize(req.body.postTitle),
        postcontent: req.body.postContent
    });
    
    const pray = new Pray ({
        postday: _.toUpper(req.body.postDay),
        postitle: _.capitalize(req.body.postTitle),
        postcontent: req.body.postContent
    });

    const devotion = new Devotion ({
        postday: _.toUpper(req.body.postDay),
        postitle: _.capitalize(req.body.postTitle),
        postcontent: req.body.postContent
    });
    try {
         if (postSection === "Home"){ 
            const post = await Home.findOne({postitle: home.postitle});
            if (!post){ 
                home.save()
                res.redirect("/home")
            } else{
            res.redirect("/home");
            }
        } else if(postSection === "Devotion"){ 
            const post = await Devotion.findOne({postitle: devotion.postitle});
        if (!post){ 
            devotion.save()
            res.redirect("/devotional")
        } else {
        res.redirect("/devotional");
       }   
        }else if(postSection === "Pray"){ 
            const post = await Pray.findOne({postitle: pray.postitle});
            if (!post){ 
                pray.save()
                res.redirect("/prayer");
            } else { 
            res.redirect("/prayer");
            }
        }
    }
    catch (error) {
        console.error(error)
    }
});

app.get("/:postName", isLoggedIn, async(req, res) =>{ 
    const requestTitle = _.capitalize(req.params.postName);
    const foundList = await Home.find();
    let postSend = null;
    try {
      for (let i = 0; i < foundList.length;i++){
        if (foundList[i].postitle === requestTitle){ 
            postSend = foundList[i];
            break
        } 
      }
      if (!postSend){ 
        return res.redirect("/home")
      }
      res.render("server", {post: postSend});
    } catch (error) {
        console.log(error);
    }
});