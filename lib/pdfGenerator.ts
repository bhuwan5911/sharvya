import jsPDF from 'jspdf';

interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  degree: string;
  field: string;
  university: string;
  graduationYear: string;
  skills: string[];
  achievements: string[];
  projects: Array<{ title: string; description: string }>;
  certifications: string[];
}

export function generateResumePDF(data: ResumeData): void {
  try {
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(data.fullName || 'YOUR NAME', 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(data.title || 'Professional Title', 105, 40, { align: 'center' });
  
  // Contact Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTACT', 20, 60);
  doc.setFont('helvetica', 'normal');
  
  let contactY = 70;
  if (data.email) {
    doc.text(data.email, 20, contactY);
    contactY += 8;
  }
  if (data.phone) {
    doc.text(data.phone, 20, contactY);
    contactY += 8;
  }
  if (data.location) {
    doc.text(data.location, 20, contactY);
  }
  
  // Education
  if (data.degree || data.university) {
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', 20, 100);
    doc.setFont('helvetica', 'normal');
    
    let eduY = 110;
    if (data.degree) {
      doc.text(data.degree, 20, eduY);
      eduY += 6;
    }
    if (data.field) {
      doc.text(`in ${data.field}`, 20, eduY);
      eduY += 6;
    }
    if (data.university) {
      doc.text(data.university, 20, eduY);
      eduY += 6;
    }
    if (data.graduationYear) {
      doc.text(data.graduationYear, 20, eduY);
    }
  }
  
  // Skills
  if (data.skills.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', 20, 140);
    doc.setFont('helvetica', 'normal');
    doc.text(data.skills.join(' • '), 20, 150);
  }
  
  // Achievements
  if (data.achievements.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('ACHIEVEMENTS', 20, 170);
    doc.setFont('helvetica', 'normal');
    
    let achY = 180;
    data.achievements.forEach(achievement => {
      doc.text(`• ${achievement}`, 20, achY);
      achY += 6;
    });
  }
  
  // Certifications
  if (data.certifications.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATIONS', 20, 200);
    doc.setFont('helvetica', 'normal');
    
    let certY = 210;
    data.certifications.forEach(cert => {
      doc.text(`• ${cert}`, 20, certY);
      certY += 6;
    });
  }
  
  // Projects (on the right side)
  if (data.projects.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECTS', 120, 60);
    doc.setFont('helvetica', 'normal');
    
    let projY = 70;
    data.projects.forEach(project => {
      doc.setFont('helvetica', 'bold');
      doc.text(project.title, 120, projY);
      projY += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`• ${project.description}`, 120, projY);
      projY += 10;
    });
  }
  
    // Save the PDF
    doc.save(`${data.fullName || 'resume'}_resume.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
} 