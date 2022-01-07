import { useRouter } from 'next/router';

export default function BackDropClick() {
  const router = useRouter();

  router.back();

  return <></>;
}
