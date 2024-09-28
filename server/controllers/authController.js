const axios = require("axios");
const { loginOrSignupWithGoogle } = require("../controllers/userController");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const google = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
};
// Callback URL for handling the Google Login response
const googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token } = data;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    console.log(profile);
    // Code to handle user authentication and retrieval using the profile data
    await loginOrSignupWithGoogle(profile, res);

    res.redirect("http://localhost:5173/masterPiece/");
  } catch (error) {
    console.error("Error:", error.response.data.error);
    res.redirect("http://localhost:5173/masterPiece/login");
  }
};

module.exports = { google, googleCallback };
