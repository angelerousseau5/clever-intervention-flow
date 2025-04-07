
import { Ticket } from "@/hooks/useTickets";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { CustomField } from "@/types/formTypes";

interface PDFGeneratorOptions {
  intervention: Ticket;
  customFields: CustomField[];
  formValues: Record<string, string>;
  formSubmitted: boolean;
  accessInfo: any;
}

export const generateInterventionPDF = ({
  intervention,
  customFields,
  formValues,
  formSubmitted,
  accessInfo
}: PDFGeneratorOptions) => {
  if (!intervention) return;
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(`Intervention #${intervention.id.slice(0, 8)}`, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(intervention.created_at).toLocaleDateString()}`, 14, 30);
  
  // Add basic information
  doc.setFontSize(12);
  doc.text("Informations générales", 14, 40);
  
  // Create table for basic info
  const basicInfo = [
    ["Titre", intervention.title],
    ["Type", intervention.type],
    ["Statut", intervention.status],
    ["Technicien", intervention.assigned_to || "Non assigné"]
  ];
  
  (doc as any).autoTable({
    startY: 45,
    head: [["Champ", "Valeur"]],
    body: basicInfo,
    theme: 'striped',
    headStyles: { fillColor: [93, 93, 134], textColor: 255 }
  });
  
  // Add custom fields if any
  if (customFields.length > 0) {
    const fieldsY = (doc as any).lastAutoTable.finalY + 10;
    doc.text("Champs spécifiques", 14, fieldsY);
    
    const customData = customFields.map(field => [
      field.label,
      formValues[field.name] || "Non renseigné"
    ]);
    
    (doc as any).autoTable({
      startY: fieldsY + 5,
      head: [["Champ", "Valeur"]],
      body: customData,
      theme: 'striped',
      headStyles: { fillColor: [93, 93, 134], textColor: 255 }
    });
  }
  
  // Add description
  const descY = (doc as any).lastAutoTable.finalY + 10;
  doc.text("Description", 14, descY);
  
  (doc as any).autoTable({
    startY: descY + 5,
    body: [[intervention.description || "Aucune description fournie."]],
    theme: 'plain'
  });
  
  // Add submission info if submitted
  if (formSubmitted) {
    const submissionY = (doc as any).lastAutoTable.finalY + 10;
    doc.text("Informations de soumission", 14, submissionY);
    
    const submissionInfo = [
      ["Nom", `${accessInfo?.firstName} ${accessInfo?.lastName}`],
      ["Entreprise", accessInfo?.companyName],
      ["Date de soumission", new Date().toLocaleDateString()]
    ];
    
    (doc as any).autoTable({
      startY: submissionY + 5,
      body: submissionInfo,
      theme: 'striped'
    });
  }
  
  // Save the PDF
  doc.save(`intervention-${intervention.id.slice(0, 8)}.pdf`);
};
