import Layout from 'src/components/layouts';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useEffect } from 'react';

export default function Dashboard() {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      if (['admin', 'teacher'].includes(session.user.role)) {
        router.replace('/exams');
      } else {
        router.replace('/examinations');
      }
    }
  }, [session]);

  return (
    <Layout>
      Dashboard
    </Layout>
  );
}
