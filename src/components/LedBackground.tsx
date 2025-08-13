// src/components/LedBackground.tsx
export default function LedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="led-blobs" />
      <div className="led-grid" />
    </div>
  );
}
