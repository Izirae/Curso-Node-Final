import passport from "passport";
import GithubStrategy from "passport-github2";
import config from "../config.js";

import UserService from "../services/user.service.js";

let userService = new UserService();

const initializePassportGithub = () => {

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: "https://curso-node-final-production.up.railway.app/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await userService.findUser(profile._json.email);
        console.log(profile);
        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            last_name: "test-lastname",
            email: profile._json.email,
            age: 0,
            password: "",
          };

          const result = await userService.addUser(newUser);

          done(null, result);
        } else {
          done(null, user);
        }
      }
    )
  );
};

export default initializePassportGithub;
