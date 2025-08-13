"use client";
export default function AuroraBg(){
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <span className="absolute -top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full blur-[70px] opacity-[.18]"
            style={{background:"#9146ff"}} />
      <span className="absolute top-1/3 -right-1/4 w-[55vw] h-[55vw] rounded-full blur-[70px] opacity-[.14]"
            style={{background:"#22d3ee"}} />
      <span className="absolute bottom-[-20vh] left-1/3 w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-[.12]"
            style={{background:"#f472b6"}} />
    </div>
  );
}
