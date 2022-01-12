export default function BackDropClick() {
  if (typeof window !== 'undefined') {
    window.history.back();
  }

  return <></>;
}
