import React, { useState } from 'react';
import { ArrowLeft, Download, Loader2, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { shopConfig } from '../config/shopConfig';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n: number) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const BORDER = '1px solid #333';
const bs = (extra?: React.CSSProperties): React.CSSProperties => ({
  border: BORDER, padding: '5px 8px', fontSize: 13, ...extra,
});
const bh = (extra?: React.CSSProperties): React.CSSProperties => ({
  ...bs(extra), fontWeight: 'bold', backgroundColor: '#fff', textAlign: 'center' as const,
});

// ─── Filename helper ───────────────────────────────────────────────────────────
const buildFileName = (name: string, city: string) => {
  const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  const safe = (s: string) => s.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
  return `${safe(name)}_${safe(city)}_${date}.pdf`;
};

// ─── Pure-jsPDF generator ─────────────────────────────────────────────────────
async function generatePDF(
  data: {
    shopConfig: typeof shopConfig;
    customerDetails: {
      name: string; mobile: string; email?: string;
      address: string; city: string; state: string; pincode: string;
    };
    cartItems: {
      product: { id: string; name: string; content?: string; price: number; actualPrice: number };
      quantity: number;
    }[];
    orderDate: string;
    totalSavings: number;
    overallTotal: number;
    packingChargesPercent: number;
  },
  filename: string
) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const L = 10, R = pageW - 10, W = R - L;
  const BOTTOM_MARGIN = 15;
  let y = 10;

  doc.setLineWidth(0.3);
  doc.setDrawColor(0);

  const ensurePage = (neededH: number) => {
    if (y + neededH > pageH - BOTTOM_MARGIN) {
      doc.addPage(); y = 10;
      doc.setLineWidth(0.3); doc.setDrawColor(0);
    }
  };

  const drawRect = (rowY: number, h: number) => doc.rect(L, rowY, W, h);
  const vLine = (x: number, rowY: number, h: number) => doc.line(x, rowY, x, rowY + h);
  const mid = (rowY: number, h: number) => rowY + h / 2 + 1.2;
  const tC = (t: string, rowY: number, h: number, cx: number) =>
    doc.text(t, cx, mid(rowY, h), { align: 'center', baseline: 'middle' });
  const tL = (t: string, rowY: number, h: number, x = L + 3) =>
    doc.text(t, x, mid(rowY, h), { baseline: 'middle' });
  const tR = (t: string, rowY: number, h: number, x = R - 3) =>
    doc.text(t, x, mid(rowY, h), { align: 'right', baseline: 'middle' });

  // Header
  const rows: [string, () => void][] = [
    ['r1', () => {
      drawRect(y, 8); doc.setFontSize(13); doc.setFont('h', 'bold');
      tC('ESTIMATE', y, 8, pageW / 2);
      doc.setFontSize(9); doc.setFont('h', 'normal');
      tR(`Date : ${data.orderDate}`, y, 8); y += 8;
    }],
    ['r2', () => {
      drawRect(y, 7); doc.setFontSize(9); doc.setFont('h', 'bold');
      tL(`Mobile :  ${data.shopConfig.mobile}`, y, 7);
      tR(`E-mail : ${data.shopConfig.email}`, y, 7); y += 7;
    }],
    ['r3', () => {
      drawRect(y, 10); doc.setFontSize(14); doc.setFont('h', 'bold');
      tC(data.shopConfig.name, y, 10, pageW / 2); y += 10;
    }],
    ['r4', () => {
      drawRect(y, 7); doc.setFontSize(9); doc.setFont('h', 'normal');
      tC(data.shopConfig.address, y, 7, pageW / 2); y += 7;
    }],
  ];
  rows.forEach(([, fn]) => fn());

  // Customer
  const { customerDetails: cd } = data;
  drawRect(y, 6); doc.setFont('h', 'bold'); doc.setFontSize(9);
  tL('Customer Details', y, 6); y += 6;

  const custLines = [
    cd.name, cd.mobile, cd.email ?? '',
    [cd.address, cd.city, cd.state, cd.pincode].filter(Boolean).join(', '),
  ].filter(Boolean);

  custLines.forEach((line) => {
    drawRect(y, 6); doc.setFont('h', 'normal'); doc.setFontSize(9);
    tL(line, y, 6); y += 6;
  });
  y += 2;

  // Product table columns
  const col = {
    sno:        { x: L,       w: 10 },
    name:       { x: L + 10,  w: 60 },
    actualPrice:{ x: L + 70,  w: 25 },
    discount:   { x: L + 95,  w: 20 },
    price:      { x: L + 115, w: 25 },
    qty:        { x: L + 140, w: 15 },
    amount:     { x: L + 155, w: W - 155 },
  };
  const divs = (rowY: number, h: number) => {
    vLine(col.name.x,        rowY, h);
    vLine(col.actualPrice.x, rowY, h);
    vLine(col.discount.x,    rowY, h);
    vLine(col.price.x,       rowY, h);
    vLine(col.qty.x,         rowY, h);
    vLine(col.amount.x,      rowY, h);
  };

  const drawHeader = () => {
    const thH = 8;
    ensurePage(thH);
    drawRect(y, thH); divs(y, thH);
    doc.setFont('h', 'bold'); doc.setFontSize(9);
    tC('S.No',         y, thH, col.sno.x          + col.sno.w          / 2);
    tC('Product Name', y, thH, col.name.x          + col.name.w / 2);
    tC('Actual Price', y, thH, col.actualPrice.x   + col.actualPrice.w  / 2);
    tC('Discount',     y, thH, col.discount.x      + col.discount.w     / 2);
    tC('Price',        y, thH, col.price.x         + col.price.w        / 2);
    tC('QTY',          y, thH, col.qty.x           + col.qty.w          / 2);
    tC('Amount (Rs)',  y, thH, col.amount.x        + col.amount.w / 2);
    y += thH;
  };

  drawHeader();

  const tdH = 7;
  data.cartItems.forEach((item, i) => {
    if (y + tdH > pageH - BOTTOM_MARGIN) {
      doc.addPage(); y = 10;
      doc.setLineWidth(0.3); doc.setDrawColor(0);
      drawHeader();
    }
    const amount = item.product.price * item.quantity;
    drawRect(y, tdH); divs(y, tdH);
    doc.setFont('h', 'normal'); doc.setFontSize(9);
    tC(String(i + 1),                    y, tdH, col.sno.x          + col.sno.w          / 2);
    tC(item.product.name,                y, tdH, col.name.x         + col.name.w / 2);
    tC(String(item.product.actualPrice), y, tdH, col.actualPrice.x  + col.actualPrice.w  / 2);
    tC('80%',                            y, tdH, col.discount.x     + col.discount.w     / 2);
    tC(String(item.product.price),       y, tdH, col.price.x        + col.price.w        / 2);
    tC(String(item.quantity),            y, tdH, col.qty.x          + col.qty.w          / 2);
    tC(fmtINR(amount),                   y, tdH, col.amount.x       + col.amount.w / 2);
    y += tdH;
  });

  // Summary
  const packingCharges = data.packingChargesPercent > 0
    ? Math.round(data.overallTotal * data.packingChargesPercent / 100) : 0;
  const finalAmount = data.overallTotal + packingCharges;

  const srH = 7;
  const divX = L + W - 45;

  ensurePage(srH);
  drawRect(y, srH); vLine(divX, y, srH);
  doc.setFont('h', 'normal'); doc.setFontSize(9);
  tR('Sub Total', y, srH, divX - 3);
  tR(fmtINR(data.overallTotal), y, srH, R - 3);
  y += srH;

  ensurePage(srH);
  drawRect(y, srH); vLine(divX, y, srH);
  doc.setFont('h', 'normal'); doc.setFontSize(9);
  tL(`You Save : ${fmtINR(data.totalSavings)}`, y, srH, L + 3);
  tR(`Packing (${data.packingChargesPercent}%)`, y, srH, divX - 3);
  tR(packingCharges === 0 ? '0' : fmtINR(packingCharges), y, srH, R - 3);
  y += srH;

  ensurePage(srH);
  drawRect(y, srH); vLine(divX, y, srH);
  doc.setFont('h', 'bold'); doc.setFontSize(9);
  tR('Total', y, srH, divX - 3);
  tR(fmtINR(finalAmount), y, srH, R - 3);
  y += srH;

  const btH = 7;
  ensurePage(btH);
  drawRect(y, btH);
  vLine(divX, y, btH);
  doc.setFont('h', 'bold'); doc.setFontSize(9);
  tL(`Total Items : ${data.cartItems.length}`, y, btH);
  tR('Overall Total', y, btH, divX - 3);
  tR(fmtINR(finalAmount), y, btH, R - 3);

  doc.save(filename);
}

// ─── Component ────────────────────────────────────────────────────────────────
const InvoicePage: React.FC = () => {
  const { cartItems, customerDetails, netTotal, totalSavings, overallTotal, orderDate, setCurrentPage } = useApp();
  const [loading, setLoading]               = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [orderPlaced, setOrderPlaced]       = useState(false);

  const packingChargesPercent = shopConfig.packingChargesPercent ?? 0;
  const packingCharges = packingChargesPercent > 0 ? Math.round(overallTotal * packingChargesPercent / 100) : 0;
  const finalAmount = overallTotal + packingCharges;

  const buildPDFData = () => ({
    shopConfig, customerDetails: customerDetails!, cartItems, orderDate,
    netTotal, totalSavings, overallTotal, packingChargesPercent,
  });

  const handleDownload = async () => {
    if (!customerDetails) return;
    setLoading('download');
    try {
      const fileName = buildFileName(customerDetails.name, customerDetails.city);
      await generatePDF(buildPDFData(), fileName);
    } catch (e) { console.error(e); }
    setLoading(null);
  };

  const handlePlaceOrder = async () => {
    if (!customerDetails) return;
    setLoading('place-order'); setSuccessMessage('');
    try {
      const { jsPDF } = await import('jspdf');
      const data = buildPDFData();
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const L = 10, R = pageW - 10, W = R - L;
      const BOTTOM_MARGIN = 15;
      let y = 10;
      doc.setLineWidth(0.3); doc.setDrawColor(0);

      const ensurePage = (neededH: number) => {
        if (y + neededH > pageH - BOTTOM_MARGIN) { doc.addPage(); y = 10; doc.setLineWidth(0.3); doc.setDrawColor(0); }
      };
      const drawRect = (rowY: number, h: number) => doc.rect(L, rowY, W, h);
      const vLine = (x: number, rowY: number, h: number) => doc.line(x, rowY, x, rowY + h);
      const mid = (rowY: number, h: number) => rowY + h / 2 + 1.2;
      const tC = (t: string, rowY: number, h: number, cx: number) => doc.text(t, cx, mid(rowY, h), { align: 'center', baseline: 'middle' });
      const tL = (t: string, rowY: number, h: number, x = L + 3) => doc.text(t, x, mid(rowY, h), { baseline: 'middle' });
      const tR = (t: string, rowY: number, h: number, x = R - 3) => doc.text(t, x, mid(rowY, h), { align: 'right', baseline: 'middle' });

      drawRect(y, 8); doc.setFontSize(13); doc.setFont('h', 'bold');
      tC('ESTIMATE', y, 8, pageW / 2);
      doc.setFontSize(9); doc.setFont('h', 'normal');
      tR(`Date : ${data.orderDate}`, y, 8); y += 8;

      drawRect(y, 7); doc.setFontSize(9); doc.setFont('h', 'bold');
      tL(`Mobile :  ${data.shopConfig.mobile}`, y, 7);
      tR(`E-mail : ${data.shopConfig.email}`, y, 7); y += 7;

      drawRect(y, 10); doc.setFontSize(14); doc.setFont('h', 'bold');
      tC(data.shopConfig.name, y, 10, pageW / 2); y += 10;

      drawRect(y, 7); doc.setFontSize(9); doc.setFont('h', 'normal');
      tC(data.shopConfig.address, y, 7, pageW / 2); y += 7;

      const cd = data.customerDetails;
      drawRect(y, 6); doc.setFont('h', 'bold'); doc.setFontSize(9);
      tL('Customer Details', y, 6); y += 6;
      [cd.name, cd.mobile, cd.email ?? '', [cd.address, cd.city, cd.state, cd.pincode].filter(Boolean).join(', ')]
        .filter(Boolean).forEach(line => { drawRect(y, 6); doc.setFont('h', 'normal'); doc.setFontSize(9); tL(line, y, 6); y += 6; });
      y += 2;

      const col = {
        sno:         { x: L,       w: 8  },
        name:        { x: L + 8,   w: 55 },
        actualPrice: { x: L + 63,  w: 28 },
        discount:    { x: L + 91,  w: 22 },
        price:       { x: L + 113, w: 25 },
        qty:         { x: L + 138, w: 15 },
        amount:      { x: L + 153, w: 37 },
      };
      const divs = (rowY: number, h: number) => {
        vLine(col.name.x, rowY, h); vLine(col.actualPrice.x, rowY, h);
        vLine(col.discount.x, rowY, h); vLine(col.price.x, rowY, h);
        vLine(col.qty.x, rowY, h); vLine(col.amount.x, rowY, h);
      };
      const drawHeader = () => {
        const thH = 8; ensurePage(thH);
        drawRect(y, thH); divs(y, thH);
        doc.setFont('h', 'bold'); doc.setFontSize(8);
        tC('S.No',         y, thH, col.sno.x + col.sno.w / 2);
        tC('Product Name', y, thH, col.name.x + col.name.w / 2);
        tC('Actual Price', y, thH, col.actualPrice.x + col.actualPrice.w / 2);
        tC('Discount',     y, thH, col.discount.x + col.discount.w / 2);
        tC('Price',        y, thH, col.price.x + col.price.w / 2);
        tC('QTY',          y, thH, col.qty.x + col.qty.w / 2);
        tC('Amount (Rs)',  y, thH, col.amount.x + col.amount.w / 2);
        y += thH;
      };
      drawHeader();

      const tdH = 7;
      data.cartItems.forEach((item, i) => {
        if (y + tdH > pageH - BOTTOM_MARGIN) { doc.addPage(); y = 10; doc.setLineWidth(0.3); doc.setDrawColor(0); drawHeader(); }
        const amount = item.product.price * item.quantity;
        drawRect(y, tdH); divs(y, tdH);
        doc.setFont('h', 'normal'); doc.setFontSize(8);
        tC(String(i + 1),                    y, tdH, col.sno.x + col.sno.w / 2);
        tC(item.product.name,                y, tdH, col.name.x + col.name.w / 2);
        tC(String(item.product.actualPrice), y, tdH, col.actualPrice.x + col.actualPrice.w / 2);
        tC('80%',                            y, tdH, col.discount.x + col.discount.w / 2);
        tC(String(item.product.price),       y, tdH, col.price.x + col.price.w / 2);
        tC(String(item.quantity),            y, tdH, col.qty.x + col.qty.w / 2);
        tC(fmtINR(amount),                   y, tdH, col.amount.x + col.amount.w / 2);
        y += tdH;
      });

      const packingCharges2 = data.packingChargesPercent > 0 ? Math.round(data.overallTotal * data.packingChargesPercent / 100) : 0;
      const finalAmount2 = data.overallTotal + packingCharges2;
      const srH = 7;
      const divX = L + W - 45;

      ensurePage(srH); drawRect(y, srH); vLine(divX, y, srH);
      doc.setFont('h', 'normal'); doc.setFontSize(9);
      tR('Sub Total', y, srH, divX - 3); tR(fmtINR(data.overallTotal), y, srH, R - 3); y += srH;

      ensurePage(srH); drawRect(y, srH); vLine(divX, y, srH);
      doc.setFont('h', 'normal'); doc.setFontSize(9);
      tL(`You Save : ${fmtINR(data.totalSavings)}`, y, srH, L + 3);
      tR(`Packing (${data.packingChargesPercent}%)`, y, srH, divX - 3);
      tR(packingCharges2 === 0 ? '0' : fmtINR(packingCharges2), y, srH, R - 3); y += srH;

      ensurePage(srH); drawRect(y, srH); vLine(divX, y, srH);
      doc.setFont('h', 'bold'); doc.setFontSize(9);
      tR('Total', y, srH, divX - 3); tR(fmtINR(finalAmount2), y, srH, R - 3); y += srH;

      const btH = 7; ensurePage(btH);
      drawRect(y, btH); vLine(divX, y, btH);
      doc.setFont('h', 'bold'); doc.setFontSize(9);
      tL(`Total Items : ${data.cartItems.length}`, y, btH);
      tR('Overall Total', y, btH, divX - 3);
      tR(fmtINR(finalAmount2), y, btH, R - 3);

      const pdfBase64 = doc.output('datauristring').split(',')[1];

      const res = await fetch('/api/send-order-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerDetails.name,
          customerMobile: customerDetails.mobile,
          customerEmail: customerDetails.email,
          customerAddress: customerDetails.address,
          customerCity: customerDetails.city,
          customerState: customerDetails.state,
          customerPincode: customerDetails.pincode,
          cartItems: cartItems.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
          netTotal,
          overallTotal: finalAmount2,
          pdfBase64,
        }),
      });

      const result = await res.json();
      const fileName = buildFileName(customerDetails.name, customerDetails.city);

      if (res.ok && result.success) {
        setSuccessMessage('Order placed! Estimate sent to WhatsApp ✅');
        setOrderPlaced(true);
        await generatePDF(buildPDFData(), fileName);
      } else {
        console.error('Order error:', result);
        setSuccessMessage('WhatsApp send failed. PDF downloaded to your mobile/laptop instead. Please send it to our WhatsApp');
        await generatePDF(buildPDFData(), fileName);
      }
    } catch (e) { 
      console.error(e);
      const fileName = buildFileName(customerDetails.name, customerDetails.city);
      await generatePDF(buildPDFData(), fileName);
      setSuccessMessage('Error placing order. Please try again or Download PDF and send it to our WhatsApp'); 
    }
    setLoading(null);
  };

  if (!customerDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No order data found</p>
          <button onClick={() => setCurrentPage('home')} className="mt-4 text-red-700 font-semibold hover:text-red-600">Go back to shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-3">
      <div className="w-full max-w-4xl mx-auto">

        <div className="flex items-center gap-2 mb-4 w-full">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 font-bold whitespace-nowrap flex-shrink-0"
            style={{ fontSize: 'clamp(11px, 3vw, 15px)' }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 stroke-[2.5]" />
            <span>Back to products</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={loading !== null}
            className="flex items-center justify-center gap-1 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded transition-colors w-[38%] sm:w-[48%]"
            style={{ fontSize: 'clamp(11px, 3vw, 14px)', padding: 'clamp(6px,1.5vw,8px) clamp(8px,2vw,16px)' }}
          >
            {loading === 'download' ? <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" /> : <Download className="w-3 h-3 flex-shrink-0" />}
            <span className="whitespace-nowrap">Download PDF</span>
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading !== null || orderPlaced}
            className="flex items-center justify-center gap-1 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded transition-colors w-[38%] sm:w-[48%]"
            style={{ fontSize: 'clamp(11px, 3vw, 14px)', padding: 'clamp(6px,1.5vw,9px) clamp(8px,2vw,16px)' }}
          >
            {loading === 'place-order' ? <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" /> : <FileText className="w-3 h-3 flex-shrink-0" />}
            <span className="whitespace-nowrap">{orderPlaced ? 'Order Placed' : 'Place Order'}</span>
          </button>
        </div>

        {successMessage && (
          <div className={`mb-5 p-3 rounded text-center font-semibold text-sm ${successMessage.includes('successfully') ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
            {successMessage}
          </div>
        )}

        <div
          id="invoice-content"
          style={{ background: '#fff', border: '2px solid #333', fontFamily: 'Arial, sans-serif', width: '100%' }}
        >
          {/* Header */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ border: BORDER, padding: '6px 8px', position: 'relative', height: 36 }} colSpan={3}>
                  <span style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontWeight: 'bold', fontSize: 'clamp(13px, 3vw, 16px)', letterSpacing: 1,
                    whiteSpace: 'nowrap',
                  }}>
                    INVOICE
                  </span>
                  <span style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 'clamp(9px, 2vw, 13px)', whiteSpace: 'nowrap',
                  }}>
                    Date : {orderDate}
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={bs({ fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>
                  Mobile :&nbsp;&nbsp;{shopConfig.mobile}
                </td>
                <td style={bs({ textAlign: 'right', fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)', whiteSpace: 'nowrap' })}>
                  E-mail : {shopConfig.email}
                </td>
              </tr>
              <tr>
                <td colSpan={3} style={bs({ textAlign: 'center', fontWeight: 'bold', fontSize: 'clamp(14px, 3.5vw, 18px)', padding: '10px 8px' })}>
                  {shopConfig.name}
                </td>
              </tr>
              <tr>
                <td colSpan={3} style={bs({ textAlign: 'center', fontSize: 'clamp(10px, 2.2vw, 13px)', paddingBottom: 10 })}>
                  {shopConfig.address}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Customer Details */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={bs({ fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>Customer Details</td></tr>
              <tr><td style={bs({ padding: '3px 8px', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>{customerDetails.name}</td></tr>
              <tr><td style={bs({ padding: '3px 8px', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>{customerDetails.mobile}</td></tr>
              {customerDetails.email && (
                <tr><td style={bs({ padding: '3px 8px', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>{customerDetails.email}</td></tr>
              )}
              <tr>
                <td style={bs({ padding: '3px 8px 8px', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>
                  {[customerDetails.address, customerDetails.city, customerDetails.state, customerDetails.pincode].filter(Boolean).join(', ')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Product table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '7%' }} />
              <col style={{ width: '33%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '16%' }} />
            </colgroup>
            <thead>
              <tr>
                {[
                  { label: 'S.No',         align: 'center' },
                  { label: 'Product Name', align: 'center' },
                  { label: 'Actual Price', align: 'center' },
                  { label: 'Discount',     align: 'center' },
                  { label: 'Price',        align: 'center' },
                  { label: 'QTY',          align: 'center' },
                  { label: 'Amount',       align: 'center' },
                ].map(({ label, align }) => (
                  <th key={label} style={{
                    border: BORDER, padding: '4px 3px',
                    fontWeight: 'bold', backgroundColor: '#fff',
                    textAlign: align as React.CSSProperties['textAlign'],
                    fontSize: 'clamp(8px, 1.8vw, 12px)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr key={item.product.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={bs({ textAlign: 'center', fontSize: 'clamp(9px, 2vw, 12px)', padding: '4px 3px' })}>{i + 1}</td>
                  <td style={bs({ textAlign: 'center', fontSize: 'clamp(9px, 2vw, 12px)', padding: '4px 5px', wordBreak: 'break-word' })}>
                    <div>{item.product.name}</div>
                    {item.product.content && <div style={{ fontSize: 'clamp(8px, 1.6vw, 10px)', color: '#666' }}>{item.product.content}</div>}
                  </td>
                  <td style={bs({ textAlign: 'center', fontSize: 'clamp(9px, 2vw, 12px)', padding: '4px 3px' })}>{item.product.actualPrice}</td>
                  <td style={bs({ textAlign: 'center', fontSize: 'clamp(9px, 2vw, 12px)', padding: '4px 3px' })}>80%</td>
                  <td style={bs({ textAlign: 'center', fontSize: 'clamp(9px, 2vw, 12px)', padding: '4px 3px' })}>{item.product.price}</td>
                  <td style={bs({ textAlign: 'center', fontSize: 'clamp(9px, 2vw, 12px)', padding: '4px 3px' })}>{item.quantity}</td>
                  <td style={bs({ textAlign: 'center', fontSize: 'clamp(9px, 2vw, 12px)', padding: '4px 5px' })}>
                    {(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sub Total */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={bs({ textAlign: 'right', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>Sub Total</td>
                <td style={bs({ textAlign: 'right', width: '25%', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>{overallTotal.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          {/* You Save + Packing */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={bs({ textAlign: 'left', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>
                  {`You Save : ${totalSavings.toLocaleString('en-IN')}`}
                </td>
                <td style={bs({ textAlign: 'right', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>{`Packing (${packingChargesPercent}%)`}</td>
                <td style={bs({ textAlign: 'right', width: '25%', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>{packingCharges === 0 ? '0' : packingCharges.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={bs({ textAlign: 'right', fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>Total</td>
                <td style={bs({ textAlign: 'right', fontWeight: 'bold', width: '25%', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>{finalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          {/* Bottom bar */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={bs({ fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>
                  Total Items : {cartItems.length}
                </td>
                <td style={bs({ textAlign: 'right', fontWeight: 'bold', width: '25%', fontSize: 'clamp(10px, 2.2vw, 13px)', whiteSpace: 'nowrap' })}>
                  Overall Total
                </td>
                <td style={bs({ textAlign: 'right', fontWeight: 'bold', width: '25%', fontSize: 'clamp(10px, 2.2vw, 13px)' })}>
                  {finalAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default InvoicePage;