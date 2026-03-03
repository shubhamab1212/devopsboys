import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "7px",
          overflow: "hidden",
          padding: "5px 5px 4px 5px",
          boxSizing: "border-box",
        }}
      >
        {/* macOS-style top dots */}
        <div
          style={{
            display: "flex",
            gap: "2.5px",
            alignItems: "center",
            marginBottom: "3px",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#f87171",
            }}
          />
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#fbbf24",
            }}
          />
          <div
            style={{
              width: "4px",
              height: "4px",
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
            gap: "2px",
            marginBottom: "3px",
          }}
        >
          <span
            style={{
              color: "#c4b5fd",
              fontSize: "11px",
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
              fontSize: "9px",
              fontWeight: 700,
              lineHeight: 1,
              fontFamily: "monospace",
              letterSpacing: "-0.5px",
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
            gap: "2px",
          }}
        >
          <div
            style={{
              width: "15px",
              height: "1.5px",
              background: "rgba(196, 181, 253, 0.5)",
              borderRadius: "1px",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "1.5px",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "1px",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
