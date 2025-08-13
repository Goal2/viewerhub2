import StreamCard from "@/components/StreamCard";

const demo = [
  { title:"Discussion chill & setup", user:"theaubeurre", game:"Just Chatting", viewers:"2.1k", thumb:"/demo/thumb1.jpg" },
  { title:"Road to Immortal", user:"poneytv", game:"Valorant", viewers:"4.3k", thumb:"/demo/thumb2.jpg" },
  { title:"Survie moddé S6", user:"luna", game:"Minecraft", viewers:"1.2k", thumb:"/demo/thumb3.jpg" },
  { title:"Ranked grind", user:"bobinator", game:"League of Legends", viewers:"3.9k", thumb:"/demo/thumb4.jpg" },
];

export default function StreamGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {demo.map((s) => (
        <StreamCard key={s.title} {...s} />
      ))}
    </div>
  );
}
