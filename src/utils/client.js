import { signOut } from 'next-auth/client';
import Router from 'next/router';

export function sendLogOut() {
  signOut({ redirect: false });
  Router.push('/auth');
}
