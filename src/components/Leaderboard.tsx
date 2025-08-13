export function Leaderboard({ title, rows }:{
  title: string;
  rows: Array<{ name: string; value: string|number }>;
}){
  const empty = !rows || rows.length===0;
  return (
    <div className="card">
      <div className="text-lg font-semibold mb-3">{title}</div>
      {empty ? (
        <div className="sub">Aucune donnée pour le moment.</div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r,i)=>(
            <li key={i} className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/5">
              <div className="truncate"><span className="text-white/50 mr-2">{i+1}.</span>{r.name}</div>
              <div className="text-white/80">{r.value}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
