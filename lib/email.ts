// Shared email template wrapper for consistent branding
export function emailTemplate(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="text-align:center;padding:24px 0 16px;">
      <div style="display:inline-block;background:#2563eb;color:white;font-weight:bold;font-size:18px;width:40px;height:40px;line-height:40px;border-radius:10px;text-align:center;">R</div>
      <p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#0f172a;">TheReviewer<span style="color:#2563eb;">.mu</span></p>
    </div>

    <!-- Content card -->
    <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
      <div style="height:4px;background:linear-gradient(90deg,#2563eb,#7c3aed);"></div>
      <div style="padding:32px 28px;">
        <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;">${title}</h2>
        ${body}
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#94a3b8;font-size:12px;">
      <p style="margin:0;">&copy; 2026 TheReviewer.mu — Trusted business reviews for Mauritius</p>
      <p style="margin:4px 0 0;">Terre Rouge, Rodrigues, Mauritius</p>
    </div>
  </div>
</body>
</html>`
}

export function emailButton(text: string, url: string, color: string = '#2563eb'): string {
  return `<a href="${url}" style="display:inline-block;background:${color};color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:14px;margin:16px 0;">${text}</a>`
}

export function emailInfoRow(label: string, value: string): string {
  return `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:110px;">${label}</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#0f172a;">${value}</td></tr>`
}

export function emailTable(rows: string): string {
  return `<table style="width:100%;border-collapse:collapse;margin:12px 0;">${rows}</table>`
}

export function emailNote(text: string): string {
  return `<div style="margin-top:16px;padding:14px;background:#f8fafc;border-radius:10px;color:#64748b;font-size:13px;line-height:1.5;">${text}</div>`
}
