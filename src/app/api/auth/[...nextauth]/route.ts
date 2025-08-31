// src/app/api/auth/[...nextauth]/route.ts

// Si tu as le path alias "@/*" -> "src/*" dans tsconfig, garde cette ligne :
export { GET, POST } from "@/auth";

// Sinon, utilise un import relatif :
// export { GET, POST } from "../../../../auth";
