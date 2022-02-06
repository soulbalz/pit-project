import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import axios from 'axios';
import { INTERNAL_API_URL } from 'src/constants';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize({ username, password }) {
        try {
          const { data } = await axios.post(`${INTERNAL_API_URL}/api/auth`, {
            username,
            password
          });

          return {
            userCode: data.userCode,
            firstName: data.firstName,
            lastName: data.lastName,
            apiToken: data.apiToken,
            role: data.role
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      }
    })
  ],
  session: {
    jwt: true,
    maxAge: 12 * 60 * 60
  },
  callbacks: {
    async session(session, token) {
      session.user = {
        userCode: token.userCode,
        firstName: token.firstName,
        lastName: token.lastName,
        apiToken: token.apiToken,
        role: token.role
      };
      return Promise.resolve(session);
    },
    async jwt(token, user, account, profile, isNewUser) {
      const isUserSignedIn = !!user;
      if (isUserSignedIn) {
        token = {
          userCode: user.userCode,
          firstName: user.firstName,
          lastName: user.lastName,
          apiToken: user.apiToken,
          role: user.role
        };
      }
      return Promise.resolve(token);
    }
  }

});
