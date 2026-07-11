export function buildMagicLinkEmail(code: string): { subject: string; html: string } {
  return {
    subject: `Your Indyer sign-in code: ${code}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#171512;">
  <table role="presentation" style="width:100%;max-width:380px;margin:40px auto;background:#efe6d0;padding:32px 24px;font-family:Georgia,'Times New Roman',serif;" cellpadding="0" cellspacing="0">
    <tr><td style="text-align:center;padding-bottom:4px;">
      <h1 style="font-family:'Times New Roman',serif;font-size:32px;color:#141210;margin:0;font-weight:normal;">The New Herald</h1>
    </td></tr>
    <tr><td style="padding:0;">
      <table role="presentation" style="width:100%;height:4px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:33.33%;background:#0e6b3f;"></td>
          <td style="width:33.33%;background:#c08a1e;"></td>
          <td style="width:33.34%;background:#a92c1e;"></td>
        </tr>
      </table>
    </td></tr>
    <tr><td><hr style="border:0;border-top:2px solid #141210;margin:0 0 24px;"></td></tr>
    <tr><td style="text-align:center;padding-bottom:16px;">
      <p style="font-family:Impact,'Arial Black',sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:2px;color:#a92c1e;margin:0;">Your sign-in code</p>
    </td></tr>
    <tr><td style="text-align:center;padding-bottom:16px;">
      <table role="presentation" style="background:#f5eeda;border:2px solid #141210;padding:16px;margin:0 auto;" cellpadding="0" cellspacing="0">
        <tr><td style="font-family:'Courier New',monospace;font-size:28px;letter-spacing:6px;color:#141210;font-weight:bold;text-align:center;">${code}</td></tr>
      </table>
    </td></tr>
    <tr><td style="text-align:center;padding-bottom:16px;">
      <p style="font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b6250;margin:0;">Expires in 15 minutes</p>
    </td></tr>
    <tr><td><hr style="border:0;border-top:1px solid #b5aa8d;margin:0 0 12px;"></td></tr>
    <tr><td style="text-align:center;padding-bottom:20px;">
      <p style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:13px;color:#26221b;margin:0;line-height:1.6;">
        This code was requested for indyer.app.<br>
        If you didn't ask for this, ignore this message.
      </p>
    </td></tr>
    <tr><td><hr style="border:0;border-top:1px solid #141210;margin:0 0 8px;"></td></tr>
    <tr><td style="text-align:center;">
      <p style="font-family:'Courier New',monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#867c65;margin:0;">Not an archival record</p>
    </td></tr>
  </table>
</body>
</html>`,
  };
}
