import Layout from 'src/components/layouts';
import { useRouter } from 'next/router';

export default function Edit() {
  const { query } = useRouter();
  return (
    <Layout>
      Student Edit: {query.id}
    </Layout>
  );
}
