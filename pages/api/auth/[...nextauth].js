import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize({ username }) {
        if (username === 'superadmin') {
          return { username };
        } else {
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
        username: token.username
      };
      return Promise.resolve(session);
    },
    async jwt(token, user, account, profile, isNewUser) {
      const isUserSignedIn = !!user;
      if (isUserSignedIn) {
        token = {
          username: user.username
        };
      }
      return Promise.resolve(token);
    }
  }

});
