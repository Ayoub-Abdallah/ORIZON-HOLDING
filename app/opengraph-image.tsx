import { ImageResponse } from "next/og";

export const alt = "ORIZON — Intelligence, engineered.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(70% 60% at 50% 100%, rgba(91,140,255,0.45), #000 70%)",
          color: "#fff",
          position: "relative",
        }}
      >
        <div style={{ fontSize: 112, letterSpacing: 40, fontWeight: 300 }}>ORIZON</div>
        <div style={{ marginTop: 24, fontSize: 26, letterSpacing: 10, opacity: 0.7 }}>ENGINEERING BEYOND THE HORIZON</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, height: 2, background: "linear-gradient(90deg, transparent, #fff, transparent)" }} />
      </div>
    ),
    size,
  );
}
