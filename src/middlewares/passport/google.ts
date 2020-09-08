import * as passport from 'passport';
import * as googleOauth from 'passport-google-oauth';
import * as fs from 'fs';
import {ProviderType} from '../../entities/provider.entity';

const googleClient = fs.readFileSync(__dirname + '/client_id_google.json').toString();
const { web: {
  client_id: clientID,
  client_secret: clientSecret,
  redirect_uris } } = JSON.parse(googleClient);

export default () => {
  const GoogleStrategy = googleOauth.OAuth2Strategy;
  passport.use(new GoogleStrategy({
      clientID,
      clientSecret,
      callbackURL: redirect_uris[0],
    }, (accessToken, refreshToken, profile, done) => {
      const {
        email,
        given_name: firstName,
        family_name: lastName,
        picture,
        email_verified: emailVerified,
        locale } = profile._json;

      return done(null, {
        email, firstName, lastName, picture, emailVerified, locale,
        providerType: ProviderType[profile.provider], photoUrl: picture
      });
    },
  ));
};
