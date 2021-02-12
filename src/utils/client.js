export async function sendLogOut() {
  console.log('sendLogOut');
}

// export const sendLogOut = async () => {
//   const res = await fetch('/api/auth/logout');
//   if (res.ok) {
//     window.location.href = '/auth/login';
//   } else {
//     toast.error('Logout failed.');
//   }
// };
