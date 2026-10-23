import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ width: 90, height: 90, borderRadius: 999, border: "9px solid #fff" }} />
        <div style={{ position: "absolute", left: 20, right: 20, top: 118, height: 3, background: "#9db8ff" }} />
      </div>
    ),
    size,
  );
}
