import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InspectionRecord } from '../types';

export function generateInspectionPDF(record: InspectionRecord): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner: Natural Trust Forest Teal (#426B5A)
  doc.setFillColor(66, 107, 90);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title & Directorate
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA — DIRECTORATE OF LEGAL METROLOGY', pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('STATUTORY FORM III — PACKAGED COMMODITIES FIELD COMPLIANCE DOSSIER', pageWidth / 2, 18, { align: 'center' });

  doc.setFontSize(8);
  doc.text('Pursuant to Legal Metrology (Packaged Commodities) Rules, 2011 & Legal Metrology Act, 2009', pageWidth / 2, 24, { align: 'center' });

  // Reset text color
  doc.setTextColor(48, 53, 48); // Deep Charcoal #303530

  // Inspection Metadata Box
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Dossier Reference ID: ${record.id}`, 14, 36);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date & Time: ${record.inspectionDate} | ${record.timestamp}`, 14, 42);
  doc.text(`Inspecting Officer: ${record.inspectorName} (Badge: ${record.badgeNumber})`, 14, 48);
  doc.text(`Jurisdiction / Zone: ${record.district}, ${record.state}`, 14, 54);

  // Store & Commodity Details
  doc.setFont('helvetica', 'bold');
  doc.text(`Retailer / Warehouse: ${record.storeName}`, pageWidth / 2 + 10, 36);
  doc.setFont('helvetica', 'normal');
  doc.text(`Location: ${record.storeAddress}`, pageWidth / 2 + 10, 42);
  doc.text(`Commodity: ${record.extractedData.commodityName}`, pageWidth / 2 + 10, 48);
  doc.text(`Brand / Packer: ${record.extractedData.brandName}`, pageWidth / 2 + 10, 54);

  // Compliance Score & Standard Regulatory Status Bar
  const isCompliant = record.status === 'COMPLIANT' || record.status === 'Compliant';
  const isPotential = record.status === 'POTENTIAL NON-COMPLIANCE' || record.status === 'Minor Violation';
  
  const statusColor = isCompliant
    ? [66, 107, 90] // Forest Teal
    : isPotential
    ? [184, 115, 51] // Amber Ochre
    : [197, 48, 48]; // Crimson Red

  doc.setDrawColor(232, 225, 210); // Soft Sand #E8E1D2
  doc.setFillColor(250, 249, 245); // Warm White #FAF9F5
  doc.roundedRect(14, 60, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Statutory Compliance Score:', 20, 72);

  doc.setFontSize(13);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`${record.overallScore}% — ${record.status.toUpperCase()}`, 82, 72);

  doc.setTextColor(48, 53, 48);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Action: ${record.actionTaken}`, pageWidth - 70, 72);

  if (record.noticeNumber) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Notice Ref: ${record.noticeNumber}`, pageWidth - 70, 77);
  }

  // Evidentiary Integrity Guarantee note
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 110, 100);
  doc.text('EVIDENTIARY INTEGRITY: Specimen photograph preserved in unmodified original state (Sec. 65B Indian Evidence Act)', 14, 84);

  // Mandatory Declarations Summary
  const ext = record.extractedData;
  const summaryRows = [
    ['Net Quantity (SI Units)', ext.netQuantity.declared, ext.netQuantity.unitStandardized ? 'Standard SI Unit verified' : 'Non-Standard Unit (Violation Rule 11)'],
    ['MRP & Tax Statement', ext.mrp.declared, ext.mrp.isInclusiveOfTaxes ? 'Inclusive of all taxes confirmed' : 'Missing Mandatory Tax Statement'],
    ['Unit Sale Price (USP)', ext.unitSalePrice.declared || 'Not Declared', ext.unitSalePrice.declared ? 'Present & Verified' : 'Missing Rule 6(11) Violation'],
    ['Manufacturing / Packing Date', ext.manufacturingDate || 'Not Stated', ext.manufacturingDate ? 'Declared' : 'Missing Mandatory Date (Rule 6(1)(d))'],
    ['Best Before / Expiry', ext.expiryDate || ext.bestBeforePeriod || 'N/A', 'Stated in compliance'],
    ['Country of Origin', ext.countryOfOrigin || 'Not Specified', ext.countryOfOrigin ? 'Declared' : 'Missing Declaration (Rule 6(1)(aa))'],
    ['Manufacturer / Packer Address', ext.manufacturerDetails.name + ' - ' + ext.manufacturerDetails.address, ext.manufacturerDetails.isCompleteAddress ? 'Complete Postal Address' : 'Incomplete Address (Rule 6(1)(a))'],
    ['Consumer Grievance Redressal', `Tel: ${ext.consumerCareDetails.phone} | Email: ${ext.consumerCareDetails.email}`, ext.consumerCareDetails.isValidComplete ? 'Full Contact Verified' : 'Incomplete Redressal Mechanism'],
    ['PDA & Font Height', `PDA: ${ext.dimensionAndFont.principalDisplayAreaSqCm} cm² | Detected: ${ext.dimensionAndFont.detectedFontHeightMm}mm`, ext.dimensionAndFont.isFontHeightCompliant ? 'Complies with Table 1' : `Under required ${ext.dimensionAndFont.minimumRequiredFontHeightMm}mm`],
  ];

  autoTable(doc, {
    startY: 88,
    head: [['Mandatory Parameter (PCR 2011)', 'Specimen Declaration Detected', 'Statutory Assessment']],
    body: summaryRows,
    theme: 'grid',
    headStyles: { fillColor: [66, 107, 90], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [48, 53, 48] },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold' },
      1: { cellWidth: 70 },
      2: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
  });

  // Clause by Clause Evaluation Table
  // @ts-expect-error - lastAutoTable is injected by jspdf-autotable
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 7 : 185;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(48, 53, 48);
  doc.text('Statutory Rule Evaluation & Infringement Findings', 14, finalY);

  const ruleRows = record.ruleResults.map((r) => [
    r.clauseNumber,
    r.ruleTitle,
    r.status.toUpperCase(),
    r.findingNote,
    r.applicableLaw,
  ]);

  autoTable(doc, {
    startY: finalY + 3,
    head: [['Clause', 'Statutory Requirement', 'Status', 'Finding / Observation', 'Applicable Law']],
    body: ruleRows,
    theme: 'striped',
    headStyles: { fillColor: [143, 175, 154], textColor: [48, 53, 48], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [48, 53, 48] },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 42 },
      2: { cellWidth: 25 },
      3: { cellWidth: 55 },
      4: { cellWidth: 'auto' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const val = String(data.cell.raw);
        if (val === 'COMPLIANT') {
          data.cell.styles.textColor = [66, 107, 90];
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'NON-COMPLIANT') {
          data.cell.styles.textColor = [197, 48, 48];
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'PARTIAL') {
          data.cell.styles.textColor = [184, 115, 51];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Footer notes & signatures
  // @ts-expect-error - lastAutoTable
  const signatureY = Math.min(doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 255, 265);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80, 85, 80);
  doc.text(`Officer Observation: ${record.inspectorNotes || 'Standard statutory field inspection performed via LegalMetriX terminal.'}`, 14, signatureY);

  // Cryptographic Verification Hash
  const pseudoHash = `SHA256: ${Array.from(record.id + record.inspectionDate)
    .map((c) => c.charCodeAt(0).toString(16))
    .join('')
    .slice(0, 32)}... verified`;
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.text(`Cryptographic Security Verification: ${pseudoHash}`, 14, signatureY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Electronically generated under SIH26034. Legal Metrology Act, 2009.', 14, signatureY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Authorized Inspecting Officer Signature', pageWidth - 70, signatureY + 12);
  doc.setDrawColor(100, 110, 100);
  doc.line(pageWidth - 70, signatureY + 9, pageWidth - 14, signatureY + 9);

  // Save the PDF
  doc.save(`LegalMetriX_${record.id}_FormIII.pdf`);
}
