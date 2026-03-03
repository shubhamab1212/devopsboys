import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #4f46e5 45%, #2563eb 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "40px",
          overflow: "hidden",
          padding: "28px 28px 24px 28px",
          boxSizing: "border-box",
        }}
      >
        {/* macOS-style top dots */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#f87171",
            }}
          />
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#fbbf24",
            }}
          />
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#34d399",
            }}
          />
        </div>

        {/* Prompt line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <span
            style={{
              color: "#c4b5fd",
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: "monospace",
            }}
          >
            ›
          </span>
          <span
            style={{
              color: "white",
              fontSize: "42px",
              fontWeight: 700,
              lineHeight: 1,
              fontFamily: "monospace",
            }}
          >
            _
          </span>
        </div>

        {/* Fake code lines */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "7px",
              background: "rgba(196, 181, 253, 0.5)",
              borderRadius: "4px",
            }}
          />
          <div
            style={{
              width: "58px",
              height: "7px",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
