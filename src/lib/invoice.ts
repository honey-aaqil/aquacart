import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { IOrder } from '@/models/Order';

/**
 * Generate a GST-compliant PDF invoice for a paid order.
 * Returns the relative URL path to the saved PDF.
 */
export async function generateInvoice(order: IOrder): Promise<string> {
  const invoicesDir = path.join(process.cwd(), 'public', 'invoices');

  // Ensure directory exists
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const fileName = `invoice-${order._id.toString()}.pdf`;
  const filePath = path.join(invoicesDir, fileName);
  const publicUrl = `/invoices/${fileName}`;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // ── Header ──
    doc
      .fillColor('#0050cb')
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('AquaCart', 50, 50);

    doc
      .fillColor('#666666')
      .fontSize(10)
      .font('Helvetica')
      .text('Tax Invoice / Receipt', 50, 85);

    // Invoice meta – right side
    doc
      .fillColor('#333333')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(`Invoice #: ${order._id.toString().slice(-8).toUpperCase()}`, 350, 50, { align: 'right' })
      .font('Helvetica')
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 350, 65, { align: 'right' })
      .text(`Payment ID: ${order.razorpayPaymentId || 'N/A'}`, 350, 80, { align: 'right' });

    // ── Divider ──
    doc
      .moveTo(50, 110)
      .lineTo(545, 110)
      .strokeColor('#e0e0e0')
      .stroke();

    // ── Bill To ──
    doc
      .fillColor('#333333')
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('Bill To:', 50, 125);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(order.customerName, 50, 142)
      .text(order.customerEmail, 50, 157)
      .text(order.customerPhone, 50, 172);

    // ── Ship To ──
    doc
      .font('Helvetica-Bold')
      .text('Ship To:', 300, 125);

    doc
      .font('Helvetica')
      .text(order.deliveryAddress.street, 300, 142)
      .text(`${order.deliveryAddress.city}, ${order.deliveryAddress.state}`, 300, 157)
      .text(order.deliveryAddress.zipCode, 300, 172);

    // ── Table Header ──
    const tableTop = 210;

    doc
      .fillColor('#f5f5f5')
      .rect(50, tableTop - 5, 495, 22)
      .fill();

    doc
      .fillColor('#333333')
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('#', 55, tableTop, { width: 25 })
      .text('Item', 80, tableTop, { width: 220 })
      .text('Qty', 310, tableTop, { width: 50, align: 'center' })
      .text('Unit Price', 370, tableTop, { width: 80, align: 'right' })
      .text('Total', 460, tableTop, { width: 80, align: 'right' });

    // ── Table Rows ──
    let y = tableTop + 28;
    doc.font('Helvetica').fontSize(9);

    order.items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;

      doc
        .fillColor('#555555')
        .text(`${index + 1}`, 55, y, { width: 25 })
        .text(item.name, 80, y, { width: 220 })
        .text(`${item.quantity}`, 310, y, { width: 50, align: 'center' })
        .text(`₹${item.price.toFixed(2)}`, 370, y, { width: 80, align: 'right' })
        .text(`₹${lineTotal.toFixed(2)}`, 460, y, { width: 80, align: 'right' });

      y += 20;
    });

    // ── Subtotal / Tax / Total ──
    y += 10;
    doc
      .moveTo(350, y)
      .lineTo(545, y)
      .strokeColor('#e0e0e0')
      .stroke();

    y += 10;
    const subtotal = order.totalAmount;
    const gstRate = 0.05; // 5% GST for fish/seafood
    const gstAmount = subtotal * gstRate;
    const grandTotal = subtotal; // GST is already included in price for display

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#555555')
      .text('Subtotal:', 370, y, { width: 80, align: 'right' })
      .text(`₹${(subtotal / (1 + gstRate)).toFixed(2)}`, 460, y, { width: 80, align: 'right' });

    y += 18;
    doc
      .text('GST (5% incl.):', 370, y, { width: 80, align: 'right' })
      .text(`₹${(subtotal - subtotal / (1 + gstRate)).toFixed(2)}`, 460, y, { width: 80, align: 'right' });

    y += 18;
    doc
      .moveTo(350, y)
      .lineTo(545, y)
      .strokeColor('#e0e0e0')
      .stroke();

    y += 8;
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#0050cb')
      .text('Grand Total:', 350, y, { width: 100, align: 'right' })
      .text(`₹${grandTotal.toFixed(2)}`, 460, y, { width: 80, align: 'right' });

    // ── Footer ──
    doc
      .fillColor('#999999')
      .fontSize(8)
      .font('Helvetica')
      .text('Thank you for shopping with AquaCart!', 50, 720, { align: 'center' })
      .text('This is a computer-generated invoice and does not require a signature.', 50, 732, { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(publicUrl));
    stream.on('error', reject);
  });
}
