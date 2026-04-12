// Shared email template wrapper for consistent branding
export function emailSignature(): string {
  return `
    <!-- Signature -->
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;">
      <table style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:16px;vertical-align:top;">
            <div style="background:#2563eb;color:white;font-weight:bold;font-size:20px;width:48px;height:48px;line-height:48px;border-radius:12px;text-align:center;">R</div>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">Timothée Lisette</p>
            <p style="margin:2px 0 0;font-size:12px;color:#2563eb;font-weight:600;">Founder & CEO</p>
            <p style="margin:8px 0 0;font-size:12px;color:#64748b;line-height:1.6;">
              <span style="color:#475569;">Phone/WhatsApp:</span> <a href="tel:+23058137384" style="color:#2563eb;text-decoration:none;">+230 5813 7384</a><br>
              <span style="color:#475569;">Email:</span> <a href="mailto:contact@thereviewer.mu" style="color:#2563eb;text-decoration:none;">contact@thereviewer.mu</a>
            </p>
            <p style="margin:10px 0 0;">
              <span style="font-size:14px;font-weight:700;color:#0f172a;">TheReviewer</span><span style="font-size:14px;font-weight:700;color:#2563eb;">.mu</span>
            </p>
            <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;font-style:italic;">Discover, rate, and book the best businesses in Mauritius</p>
          </td>
        </tr>
      </table>
    </div>`
}

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
      <div style="height:4px;background:linear-gradient(90deg,#06b6d4,#2563eb,#7c3aed);"></div>
      <div style="padding:32px 28px;">
        <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;">${title}</h2>
        ${body}
        ${emailSignature()}
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#94a3b8;font-size:11px;">
      <p style="margin:0;">&copy; 2026 TheReviewer.mu — Discover, rate, and book the best businesses in Mauritius</p>
      <p style="margin:4px 0 0;">Terre Rouge, Rodrigues, Mauritius</p>
      <p style="margin:8px 0 0;">
        <a href="https://thereviewer.vercel.app" style="color:#2563eb;text-decoration:none;font-weight:600;">Visit our website</a>
        &nbsp;·&nbsp;
        <a href="https://thereviewer.vercel.app/contact" style="color:#2563eb;text-decoration:none;">Contact us</a>
      </p>
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
