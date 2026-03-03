<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS Feed</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #09090b;
            color: #e4e4e7;
            min-height: 100vh;
            line-height: 1.6;
          }

          a { color: #60a5fa; text-decoration: none; }
          a:hover { text-decoration: underline; }

          .wrap { max-width: 760px; margin: 0 auto; padding: 0 1.25rem 4rem; }

          /* ── Header ── */
          .header {
            border-bottom: 1px solid #27272a;
            padding: 2rem 0 1.75rem;
            margin-bottom: 2.5rem;
          }
          .header-inner {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
          }
          .logo {
            width: 48px; height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #3b82f6, #7c3aed);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            font-size: 22px;
          }
          .header-text h1 {
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(90deg, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
            margin-bottom: 0.25rem;
          }
          .header-text p {
            color: #71717a;
            font-size: 0.875rem;
          }
          .subscribe-bar {
            margin-top: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex-wrap: wrap;
          }
          .badge {
            display: inline-flex; align-items: center; gap: 0.4rem;
            padding: 0.3rem 0.875rem;
            border-radius: 9999px;
            border: 1px solid #3f3f46;
            background: #18181b;
            font-size: 0.75rem;
            color: #a1a1aa;
          }
          .badge .dot {
            width: 7px; height: 7px;
            border-radius: 50%;
            background: #4ade80;
          }
          .btn {
            display: inline-flex; align-items: center; gap: 0.4rem;
            padding: 0.35rem 1rem;
            border-radius: 9999px;
            background: #1d4ed8;
            color: #fff !important;
            font-size: 0.8rem;
            font-weight: 600;
            border: none;
            text-decoration: none !important;
            transition: background 0.15s;
          }
          .btn:hover { background: #2563eb; text-decoration: none !important; }

          /* ── How to subscribe notice ── */
          .notice {
            background: #18181b;
            border: 1px solid #27272a;
            border-left: 3px solid #3b82f6;
            border-radius: 10px;
            padding: 1rem 1.25rem;
            margin-bottom: 2.5rem;
            font-size: 0.82rem;
            color: #71717a;
          }
          .notice strong { color: #a1a1aa; }

          /* ── Section label ── */
          .section-label {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #52525b;
            margin-bottom: 1rem;
          }

          /* ── Post card ── */
          .post-list { display: flex; flex-direction: column; gap: 1rem; }

          .post-card {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 14px;
            padding: 1.25rem 1.5rem;
            transition: border-color 0.2s, transform 0.15s;
          }
          .post-card:hover {
            border-color: #3f3f46;
            transform: translateY(-1px);
          }
          .post-card h2 {
            font-size: 1rem;
            font-weight: 700;
            color: #f4f4f5;
            margin-bottom: 0.5rem;
            line-height: 1.4;
          }
          .post-card h2 a { color: inherit; }
          .post-card h2 a:hover { color: #60a5fa; text-decoration: none; }
          .post-card .desc {
            color: #71717a;
            font-size: 0.875rem;
            margin-bottom: 0.875rem;
            line-height: 1.6;
          }
          .post-meta {
            display: flex; align-items: center; gap: 0.75rem;
            flex-wrap: wrap;
          }
          .post-date {
            font-size: 0.75rem;
            color: #52525b;
          }
          .tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
          .tag {
            font-size: 0.7rem;
            padding: 0.15rem 0.6rem;
            border-radius: 9999px;
            background: #27272a;
            color: #71717a;
            border: 1px solid #3f3f46;
          }
          .read-link {
            margin-left: auto;
            font-size: 0.78rem;
            font-weight: 600;
            color: #60a5fa !important;
          }
          .read-link:hover { text-decoration: underline; }

          /* ── Footer ── */
          .footer {
            border-top: 1px solid #27272a;
            margin-top: 3rem;
            padding-top: 1.5rem;
            text-align: center;
            font-size: 0.78rem;
            color: #3f3f46;
          }
        </style>
      </head>
      <body>
        <div class="wrap">

          <!-- Header -->
          <div class="header">
            <div class="header-inner">
              <div class="logo">⚙️</div>
              <div class="header-text">
                <h1><xsl:value-of select="/rss/channel/title"/></h1>
                <p><xsl:value-of select="/rss/channel/description"/></p>
              </div>
            </div>
            <div class="subscribe-bar">
              <span class="badge">
                <span class="dot"/>
                RSS Feed · <xsl:value-of select="count(/rss/channel/item)"/> articles
              </span>
              <a class="btn" href="https://devopsboys.com/blog">Browse Articles →</a>
            </div>
          </div>

          <!-- Subscribe notice -->
          <div class="notice">
            <strong>How to subscribe:</strong> Copy the URL from your browser's address bar and paste it into your RSS reader app (e.g. Feedly, Inoreader, NetNewsWire, or any RSS client).
          </div>

          <!-- Articles -->
          <p class="section-label">Latest Articles</p>
          <div class="post-list">
            <xsl:for-each select="/rss/channel/item">
              <div class="post-card">
                <h2>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h2>
                <p class="desc"><xsl:value-of select="description"/></p>
                <div class="post-meta">
                  <span class="post-date"><xsl:value-of select="pubDate"/></span>
                  <div class="tags">
                    <xsl:call-template name="split-tags">
                      <xsl:with-param name="str" select="category"/>
                    </xsl:call-template>
                  </div>
                  <a class="read-link">
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    Read →
                  </a>
                </div>
              </div>
            </xsl:for-each>
          </div>

          <!-- Footer -->
          <div class="footer">
            <a href="https://devopsboys.com">devopsboys.com</a> · Practical DevOps &amp; Cloud Knowledge
          </div>

        </div>
      </body>
    </html>
  </xsl:template>

  <!-- Helper: split comma-separated tags into individual span badges -->
  <xsl:template name="split-tags">
    <xsl:param name="str"/>
    <xsl:choose>
      <xsl:when test="contains($str, ', ')">
        <span class="tag"><xsl:value-of select="normalize-space(substring-before($str, ', '))"/></span>
        <xsl:call-template name="split-tags">
          <xsl:with-param name="str" select="substring-after($str, ', ')"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:if test="normalize-space($str) != ''">
          <span class="tag"><xsl:value-of select="normalize-space($str)"/></span>
        </xsl:if>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
