import jsPDF from 'jspdf';

/**
 * Generate PDF for booking details
 * @param {Object} bookingData - Complete booking data including user, car, and booking details
 */
export const generateBookingPDF = (bookingData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  const lineHeight = 6;
  const sectionSpacing = 12;

  // Company Colors
  const primaryColor = [33, 41, 43]; // Dark gray/black
  const accentColor = [59, 130, 246]; // Blue accent
  const lightGray = [245, 245, 245];
  const borderGray = [200, 200, 200];

  // Helper function to add text with word wrap
  const addText = (text, x, y, maxWidth, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text || 'N/A', maxWidth);
    doc.text(lines, x, y);
    doc.setTextColor(0, 0, 0);
    return lines.length * (fontSize * 0.4);
  };

  // Helper function to add section header with better styling
  const addSectionHeader = (title, y) => {
    // Background rectangle
    doc.setFillColor(...primaryColor);
    doc.roundedRect(margin, y - 6, contentWidth, 10, 2, 2, 'F');
    
    // White text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 5, y + 1);
    doc.setTextColor(0, 0, 0);
    
    return y + 8;
  };

  // Helper function to add key-value pair with better formatting
  const addKeyValue = (key, value, x, y, maxWidth, keyBold = true) => {
    const keyWidth = 60;
    const valueWidth = maxWidth - keyWidth - 5;
    
    // Key
    addText(`${key}:`, x, y, keyWidth, 9, keyBold, [60, 60, 60]);
    
    // Value
    const valueLines = doc.splitTextToSize(value || 'N/A', valueWidth);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(valueLines, x + keyWidth + 5, y);
    
    return valueLines.length * 4;
  };

  // Helper function to draw horizontal line
  const drawLine = (y) => {
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // ========== HEADER SECTION ==========
  // Top border
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 8, 'F');

  yPosition = 25;

  // Company Name - Large and Bold
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('DRIVE ON', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  // Tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('Premium Car Rental Services', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Divider line
  drawLine(yPosition);
  yPosition += 8;

  // Receipt Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('BOOKING RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Booking ID - Highlighted Box
  const bookingIdBoxY = yPosition;
  doc.setFillColor(...lightGray);
  doc.roundedRect(pageWidth / 2 - 50, bookingIdBoxY - 4, 100, 8, 2, 2, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text(`Booking ID: ${bookingData.bookingId || 'N/A'}`, pageWidth / 2, bookingIdBoxY + 1, { align: 'center' });
  yPosition += 12;

  // Booking Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const bookingDate = bookingData.createdAt 
    ? new Date(bookingData.createdAt).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
  doc.text(`Generated on: ${bookingDate}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += sectionSpacing;

  // ========== USER INFORMATION SECTION ==========
  yPosition = addSectionHeader('USER INFORMATION', yPosition);
  
  const user = bookingData.user || {};
  yPosition += addKeyValue('Name', user.name || user.fullName || 'N/A', margin, yPosition, contentWidth);
  yPosition += lineHeight;
  yPosition += addKeyValue('Email', user.email || 'N/A', margin, yPosition, contentWidth);
  yPosition += lineHeight;
  yPosition += addKeyValue('Phone', user.phone ? `+91 ${user.phone}` : 'N/A', margin, yPosition, contentWidth);
  yPosition += lineHeight;
  
  if (user.age) {
    yPosition += addKeyValue('Age', String(user.age), margin, yPosition, contentWidth);
    yPosition += lineHeight;
  }
  if (user.gender) {
    yPosition += addKeyValue('Gender', user.gender.charAt(0).toUpperCase() + user.gender.slice(1), margin, yPosition, contentWidth);
    yPosition += lineHeight;
  }
  if (user.address || bookingData.currentAddress) {
    const address = user.address || bookingData.currentAddress || 'N/A';
    yPosition += addKeyValue('Address', address, margin, yPosition, contentWidth);
    yPosition += lineHeight;
  }
  
  yPosition += sectionSpacing;
  drawLine(yPosition);
  yPosition += sectionSpacing;

  // Check if new page needed
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  // ========== CAR INFORMATION SECTION ==========
  yPosition = addSectionHeader('CAR INFORMATION', yPosition);
  
  const car = bookingData.car || {};
  yPosition += addKeyValue('Brand', car.brand || 'N/A', margin, yPosition, contentWidth);
  yPosition += lineHeight;
  yPosition += addKeyValue('Model', car.model || 'N/A', margin, yPosition, contentWidth);
  yPosition += lineHeight;
  
  if (car.year) {
    yPosition += addKeyValue('Year', String(car.year), margin, yPosition, contentWidth);
    yPosition += lineHeight;
  }
  if (car.seats || car.seatingCapacity) {
    yPosition += addKeyValue('Seats', String(car.seats || car.seatingCapacity || 'N/A'), margin, yPosition, contentWidth);
    yPosition += lineHeight;
  }
  if (car.transmission) {
    yPosition += addKeyValue('Transmission', car.transmission, margin, yPosition, contentWidth);
    yPosition += lineHeight;
  }
  if (car.fuelType) {
    yPosition += addKeyValue('Fuel Type', car.fuelType, margin, yPosition, contentWidth);
    yPosition += lineHeight;
  }
  if (car.registrationNumber) {
    yPosition += addKeyValue('Registration', car.registrationNumber, margin, yPosition, contentWidth);
    yPosition += lineHeight;
  }
  
  yPosition += sectionSpacing;
  drawLine(yPosition);
  yPosition += sectionSpacing;

  // Check if new page needed
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  // ========== BOOKING DETAILS SECTION ==========
  yPosition = addSectionHeader('BOOKING DETAILS', yPosition);
  
  // Format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  yPosition += addKeyValue('Pickup Date', formatDate(bookingData.pickupDate), margin, yPosition, contentWidth);
  yPosition += lineHeight;
  yPosition += addKeyValue('Pickup Time', bookingData.pickupTime || 'N/A', margin, yPosition, contentWidth);
  yPosition += lineHeight;
  yPosition += addKeyValue('Drop Date', formatDate(bookingData.dropDate), margin, yPosition, contentWidth);
  yPosition += lineHeight;
  yPosition += addKeyValue('Drop Time', bookingData.dropTime || 'N/A', margin, yPosition, contentWidth);
  yPosition += lineHeight;
  
  // Calculate total days
  if (bookingData.pickupDate && bookingData.dropDate) {
    try {
      const pickup = new Date(bookingData.pickupDate);
      const drop = new Date(bookingData.dropDate);
      const diffTime = Math.abs(drop - pickup);
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      yPosition += addKeyValue('Total Days', `${totalDays} day${totalDays > 1 ? 's' : ''}`, margin, yPosition, contentWidth);
      yPosition += lineHeight;
    } catch (e) {
      console.error('Error calculating days:', e);
    }
  }
  
  yPosition += sectionSpacing;
  drawLine(yPosition);
  yPosition += sectionSpacing;

  // Check if new page needed
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  // ========== ADDITIONAL DETAILS SECTION ==========
  if (bookingData.bookingPurpose || bookingData.personalDetails || bookingData.currentAddress || 
      bookingData.jobDetails || bookingData.businessDetails || bookingData.studentId) {
    yPosition = addSectionHeader('ADDITIONAL DETAILS', yPosition);
    
    if (bookingData.bookingPurpose) {
      const purposeLabels = {
        'personal': 'Personal',
        'job': 'Job',
        'business': 'Business',
        'student': 'Student'
      };
      yPosition += addKeyValue('Purpose', purposeLabels[bookingData.bookingPurpose] || bookingData.bookingPurpose, margin, yPosition, contentWidth);
      yPosition += lineHeight;
    }

    if (bookingData.personalDetails) {
      const pd = bookingData.personalDetails;
      if (pd.name) {
        yPosition += addKeyValue('Personal Name', pd.name, margin, yPosition, contentWidth);
        yPosition += lineHeight;
      }
      if (pd.phone) {
        yPosition += addKeyValue('Personal Phone', pd.phone, margin, yPosition, contentWidth);
        yPosition += lineHeight;
      }
      if (pd.email) {
        yPosition += addKeyValue('Personal Email', pd.email, margin, yPosition, contentWidth);
        yPosition += lineHeight;
      }
      if (pd.age) {
        yPosition += addKeyValue('Personal Age', String(pd.age), margin, yPosition, contentWidth);
        yPosition += lineHeight;
      }
      if (pd.gender) {
        yPosition += addKeyValue('Personal Gender', pd.gender.charAt(0).toUpperCase() + pd.gender.slice(1), margin, yPosition, contentWidth);
        yPosition += lineHeight;
      }
    }

    if (bookingData.jobDetails) {
      yPosition += addKeyValue('Job Details', bookingData.jobDetails, margin, yPosition, contentWidth);
      yPosition += lineHeight;
    }

    if (bookingData.businessDetails) {
      yPosition += addKeyValue('Business Details', bookingData.businessDetails, margin, yPosition, contentWidth);
      yPosition += lineHeight;
    }

    if (bookingData.studentId) {
      yPosition += addKeyValue('Student ID', bookingData.studentId, margin, yPosition, contentWidth);
      yPosition += lineHeight;
    }

    if (bookingData.currentAddress && !user.address) {
      yPosition += addKeyValue('Current Address', bookingData.currentAddress, margin, yPosition, contentWidth);
      yPosition += lineHeight;
    }
    
    yPosition += sectionSpacing;
    drawLine(yPosition);
    yPosition += sectionSpacing;
  }

  // Check if new page needed
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  // ========== ADD-ON SERVICES SECTION ==========
  if (bookingData.addOnServices) {
    const addOns = bookingData.addOnServices;
    const hasAddOns = Object.values(addOns).some(qty => qty > 0);
    
    if (hasAddOns) {
      yPosition = addSectionHeader('ADD-ON SERVICES', yPosition);
      
      if (addOns.driver > 0) {
        yPosition += addKeyValue('Driver', `${addOns.driver}`, margin, yPosition, contentWidth);
        yPosition += lineHeight;
      }
      if (addOns.bodyguard > 0) {
        yPosition += addKeyValue('Bodyguard', `${addOns.bodyguard}`, margin, yPosition, contentWidth);
        yPosition += lineHeight;
      }
      if (addOns.gunmen > 0) {
        yPosition += addKeyValue('Gunmen', `${addOns.gunmen}`, margin, yPosition, contentWidth);
        yPosition += lineHeight;
      }
      if (addOns.bouncer > 0) {
        yPosition += addKeyValue('Bouncer', `${addOns.bouncer}`, margin, yPosition, contentWidth);
        yPosition += lineHeight;
      }
      
      yPosition += sectionSpacing;
      drawLine(yPosition);
      yPosition += sectionSpacing;
    }
  }

  // Check if new page needed
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  // ========== PRICING DETAILS SECTION ==========
  yPosition = addSectionHeader('PRICING DETAILS', yPosition);
  
  // Format currency with proper Indian number formatting (manual formatting for jsPDF compatibility)
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '') return 'N/A';
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return 'N/A';
    
    // Round to 2 decimal places if needed
    const roundedAmount = Math.round(numAmount * 100) / 100;
    
    // Convert to string and split by decimal point
    const amountStr = Math.abs(roundedAmount).toString();
    const parts = amountStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1] || '';
    
    // Add commas for Indian numbering system (every 3 digits from right)
    // For example: 1100 -> 1,100, 1234567 -> 12,34,567
    let formattedInteger = '';
    let count = 0;
    for (let i = integerPart.length - 1; i >= 0; i--) {
      if (count === 3 && i !== integerPart.length - 1) {
        formattedInteger = ',' + formattedInteger;
        count = 0;
      }
      formattedInteger = integerPart[i] + formattedInteger;
      count++;
    }
    
    // Combine with decimal part if exists
    const formatted = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    return `₹${formatted}`;
  };

  // Calculate box height based on content
  let pricingBoxHeight = 35;
  if (bookingData.couponCode) {
    pricingBoxHeight += 12;
    if (bookingData.couponDiscount) {
      pricingBoxHeight += 6;
    }
  }

  // Pricing box with highlighted background
  const pricingBoxY = yPosition;
  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, pricingBoxY - 3, contentWidth, pricingBoxHeight, 2, 2, 'F');
  
  yPosition += 3;
  
  // Total Price - Bold and larger
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  const totalPriceText = `Total Price: ${formatCurrency(bookingData.totalPrice)}`;
  doc.text(totalPriceText, margin + 2, yPosition);
  yPosition += lineHeight + 3;
  
  // Reset font
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  yPosition += addKeyValue('Paid Amount', formatCurrency(bookingData.paidAmount || bookingData.advancePayment), margin + 2, yPosition, contentWidth - 4);
  yPosition += lineHeight;
  yPosition += addKeyValue('Remaining Amount', formatCurrency(bookingData.remainingAmount), margin + 2, yPosition, contentWidth - 4);
  yPosition += lineHeight;
  
  if (bookingData.couponCode) {
    yPosition += addKeyValue('Coupon Code', bookingData.couponCode, margin + 2, yPosition, contentWidth - 4);
    yPosition += lineHeight;
    if (bookingData.couponDiscount) {
      yPosition += addKeyValue('Discount', formatCurrency(bookingData.couponDiscount), margin + 2, yPosition, contentWidth - 4);
      yPosition += lineHeight;
    }
  }
  
  yPosition += addKeyValue('Payment Option', bookingData.paymentOption === 'advance' ? '35% Advance' : bookingData.paymentOption || 'N/A', margin + 2, yPosition, contentWidth - 4);
  yPosition = pricingBoxY + pricingBoxHeight + 2;
  
  yPosition += sectionSpacing;
  drawLine(yPosition);
  yPosition += sectionSpacing;

  // Check if new page needed
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  // ========== BOOKING STATUS SECTION ==========
  yPosition = addSectionHeader('BOOKING STATUS', yPosition);
  
  const statusLabels = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'cancelled': 'Cancelled',
    'completed': 'Completed'
  };
  
  const paymentStatusLabels = {
    'partial': 'Partial Payment',
    'full': 'Full Payment',
    'pending': 'Pending',
    'completed': 'Completed'
  };
  
  yPosition += addKeyValue('Status', statusLabels[bookingData.status] || bookingData.status || 'N/A', margin, yPosition, contentWidth);
  yPosition += lineHeight;
  yPosition += addKeyValue('Payment Status', paymentStatusLabels[bookingData.paymentStatus] || bookingData.paymentStatus || 'N/A', margin, yPosition, contentWidth);
  yPosition += lineHeight;
  yPosition += addKeyValue('Trip Status', bookingData.tripStatus ? bookingData.tripStatus.charAt(0).toUpperCase() + bookingData.tripStatus.slice(1).replace('_', ' ') : 'N/A', margin, yPosition, contentWidth);
  yPosition += sectionSpacing;
  drawLine(yPosition);
  yPosition += sectionSpacing;

  // Special Requests
  if (bookingData.specialRequests) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    yPosition = addSectionHeader('SPECIAL REQUESTS', yPosition);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const requestLines = doc.splitTextToSize(bookingData.specialRequests, contentWidth);
    doc.text(requestLines, margin, yPosition);
    yPosition += requestLines.length * 4 + sectionSpacing;
    drawLine(yPosition);
    yPosition += sectionSpacing;
  }

  // ========== FOOTER SECTION ==========
  const footerY = pageHeight - 25;
  
  // Top border for footer
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  // Company Information
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('DRIVE ON', pageWidth / 2, footerY, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Anjaneya Techno Park, First Floor, No. 147, HAL Old Airport Road,', pageWidth / 2, footerY + 4, { align: 'center' });
  doc.text('ISRO Colony, Kodihalli, Bangalore, Karnataka 560008', pageWidth / 2, footerY + 7, { align: 'center' });
  
  // Important Notice
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(200, 0, 0);
  doc.text('⚠️ This is a computer-generated receipt. Physical document verification at office is mandatory.', 
    pageWidth / 2, footerY + 12, { align: 'center' });

  // Page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  // Save PDF
  const fileName = `Booking_${bookingData.bookingId || 'Receipt'}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
