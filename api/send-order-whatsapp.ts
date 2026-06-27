import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    customerName, customerMobile, customerEmail,
    customerAddress, customerCity, customerState, customerPincode,
    cartItems, netTotal, overallTotal, pdfBase64,
  } = req.body;

  const token   = process.env.WHATSAPP_TOKEN!;
  const phoneId = process.env.WHATSAPP_PHONE_ID!;
  const toNum   = process.env.SHOP_MOBILE!;

  const itemLines = cartItems
    .map((i: any) => `• ${i.productName} x${i.quantity} = ₹${i.price * i.quantity}`)
    .join('\n');

  const caption = `🛒 *New Order Received!*

👤 *Customer:* ${customerName}
📞 *Mobile:* ${customerMobile}
📧 *Email:* ${customerEmail ?? 'N/A'}
📍 *Address:* ${customerAddress}, ${customerCity}, ${customerState} - ${customerPincode ?? ''}

🧾 *Items:*
${itemLines}

💰 *You Save:* ₹${netTotal - overallTotal}
✅ *Grand Total:* ₹${overallTotal}`.trim();

  try {
    // Step 1 — Upload PDF to WhatsApp media
    const mediaForm = new FormData();
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const pdfBlob   = new Blob([pdfBuffer], { type: 'application/pdf' });
    mediaForm.append('file', pdfBlob, `Estimate_${customerName}.pdf`);
    mediaForm.append('type', 'application/pdf');
    mediaForm.append('messaging_product', 'whatsapp');

    const uploadRes = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}/media`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: mediaForm,
      }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok || !uploadData.id) {
      console.error('Media upload failed:', uploadData);
      return res.status(500).json({ 
        error: 'Media upload failed', 
        details: uploadData 
      });
    }

    const mediaId = uploadData.id;

    // Step 2 — Send document message with media ID
    const msgRes = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: toNum,
          type: 'document',
          document: {
            id: mediaId,
            filename: `Estimate_${customerName}.pdf`,
            caption,
          },
        }),
      }
    );

    const msgData = await msgRes.json();

    if (!msgRes.ok) {
      console.error('WhatsApp send failed:', msgData);
      return res.status(500).json({ 
        error: 'WhatsApp send failed', 
        details: msgData 
      });
    }

    return res.status(200).json({ 
      success: true,
      messageId: msgData.messages?.[0]?.id 
    });

  } catch (err: any) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ 
      error: 'Unexpected server error', 
      message: err.message 
    });
  }
}