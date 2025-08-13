import dynamic from "next/dynamic";

const MessageTrend = dynamic(() => import("./MessageTrend.client"), {
  ssr: false, // ⬅️ très important
  loading: () => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 h-[280px]" />
  ),
});

export default MessageTrend;
