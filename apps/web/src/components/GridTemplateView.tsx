export function GridTemplateView({ itemCount = 30, columns = 6 }) {
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);
  const rows = Math.ceil(itemCount / columns);

  return (
    <div
      className="grid gap-4 p-6 flex-1 overflow-auto"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center justify-center rounded-lg bg-blue-500 text-white"
        >
          {item}
        </div>
      ))}
    </div>
  );
}
