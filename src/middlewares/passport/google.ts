import * as passport from 'passport';
import * as googleOauth from 'passport-google-oauth';
import * as fs from 'fs';
import User from '../../entities/user.entity';

const googleClient = fs.readFileSync(__dirname + '/client_id_google.json').toString();
const { web: {
  client_id: clientID,
  client_secret: clientSecret,
  redirect_uris } } = JSON.parse(googleClient);

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) =>  { done(null, user); });
export default () => {
  const GoogleStrategy = googleOauth.OAuth2Strategy;
  passport.use(new GoogleStrategy({
      clientID,
      clientSecret,
      callbackURL: redirect_uris[0],
    }, (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      return done(null, profile);
    },
  ));
};
