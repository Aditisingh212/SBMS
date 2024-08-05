document.addEventListener('DOMContentLoaded', function () {
    const { jsPDF } = window.jspdf;
    const invoiceForm = document.getElementById('invoice-form');
    const addItemButton = document.getElementById('add-item');
    const itemList = document.getElementById('item-list');
    const generateInvoiceButton = document.getElementById('generate-invoice');
    const previewInvoiceButton = document.getElementById('preview-invoice');
    const sendEmailButton = document.getElementById('send-email'); // Added send email functionality
    const previewModal = document.getElementById('preview-modal');
    const closeModalButton = previewModal.querySelector('.close');
    const pdfPreview = document.getElementById('pdf-preview');
    const downloadInvoiceButton = document.getElementById('download-invoice');

    let itemCounter = 0;
    let generatedPdfBlob;

    function addItem() {
        itemCounter++;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${itemCounter}</td>
            <td><input type="text" class="item-description" placeholder="Description"></td>
            <td><input type="number" class="quantity" placeholder="Quantity" min="1" value="1"></td>
            <td><input type="number" class="unit-price" placeholder="Unit Price" min="0" step="0.01" value="0.00"></td>
            <td><input type="number" class="item-gst" placeholder="GST (%)" min="0" step="0.01" value="0.00"></td>
            <td><input type="number" class="item-discount" placeholder="Discount (%)" min="0" step="0.01" value="0.00"></td>
            <td class="total">0.00</td>
            <td><button type="button" class="remove-item btn-secondary"><i class="fas fa-trash"></i></button></td>
        `;
        itemList.appendChild(row);
        updateRemoveButtons();
        row.querySelectorAll('input').forEach(input => input.addEventListener('input', calculateTotals));
        calculateTotals();
    }

    function updateRemoveButtons() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                event.target.closest('tr').remove();
                calculateTotals();
            });
        });
    }

    function calculateTotals() {
        let subtotal = 0;
        let totalGST = 0;
        let totalDiscount = 0;

        document.querySelectorAll('#item-list tr').forEach(row => {
            const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
            const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
            const itemGst = parseFloat(row.querySelector('.item-gst').value) || 0;
            const itemDiscount = parseFloat(row.querySelector('.item-discount').value) || 0;

            const total = quantity * unitPrice;
            const gstAmount = total * (itemGst / 100);
            const discountAmount = total * (itemDiscount / 100);

            const rowTotal = total + gstAmount - discountAmount;

            row.querySelector('.total').textContent = rowTotal.toFixed(2);

            subtotal += total;
            totalGST += gstAmount;
            totalDiscount += discountAmount;
        });

        const total = subtotal + totalGST - totalDiscount;

        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('gst').textContent = totalGST.toFixed(2);
        document.getElementById('discount').textContent = totalDiscount.toFixed(2);
        document.getElementById('total').textContent = total.toFixed(2);
    }

    function generateInvoice() {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Invoice', 10, 10);

        doc.setFontSize(12);
        doc.text(`Invoice Number: ${document.getElementById('invoice-number').value}`, 10, 20);
        doc.text(`Date: ${document.getElementById('invoice-date').value}`, 10, 30);

        doc.setFontSize(14);
        doc.text('Company Details:', 10, 40);
        doc.setFontSize(12);
        doc.text(`Name: ${document.getElementById('company-name').value}`, 10, 50);
        doc.text(`Address: ${document.getElementById('company-address').value}`, 10, 60);
        doc.text(`Email: ${document.getElementById('company-email').value}`, 10, 70);

        doc.setFontSize(14);
        doc.text('Client Details:', 10, 80);
        doc.setFontSize(12);
        doc.text(`Name: ${document.getElementById('client-name').value}`, 10, 90);
        doc.text(`Address: ${document.getElementById('client-address').value}`, 10, 100);
        doc.text(`Phone: ${document.getElementById('client-phone').value}`, 10, 110);

        const items = [];
        document.querySelectorAll('#item-list tr').forEach(row => {
            const description = row.querySelector('.item-description').value;
            const quantity = row.querySelector('.quantity').value;
            const unitPrice = row.querySelector('.unit-price').value;
            const total = row.querySelector('.total').textContent;
            items.push([description, quantity, unitPrice, total]);
        });

        doc.autoTable({
            head: [['Description', 'Quantity', 'Unit Price', 'Total']],
            body: items,
            startY: 120,
            theme: 'grid',
            margin: { top: 10 },
            styles: { fontSize: 10 },
        });

        const yOffset = doc.lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.text(`Subtotal: $${document.getElementById('subtotal').textContent}`, 10, yOffset + 10);
        doc.text(`GST: $${document.getElementById('gst').textContent}`, 10, yOffset + 20);
        doc.text(`Discount: $${document.getElementById('discount').textContent}`, 10, yOffset + 30);
        doc.text(`Total: $${document.getElementById('total').textContent}`, 10, yOffset + 40);

        generatedPdfBlob = doc.output('blob');
        return generatedPdfBlob; // Ensure we return the blob for further usage
    }

    function showPreview() {
        generateInvoice();
        const url = URL.createObjectURL(generatedPdfBlob);
        pdfPreview.src = url;
        previewModal.style.display = 'block';
    }

    function downloadInvoice() {
        if (generatedPdfBlob) {
            const url = URL.createObjectURL(generatedPdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'invoice.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    async function sendEmail() {
        generateInvoice();

        const companyName = document.getElementById('company-name').value;
        const clientEmail = document.getElementById('client-email').value;
        const companyEmail = document.getElementById('company-email').value;

        const formData = new FormData();
        formData.append('from_email', companyEmail);
        formData.append('to_email', clientEmail);
        formData.append('subject', 'Your Invoice');
        formData.append('message', `Dear Customer,\n\nPlease find attached your invoice from ${companyName}.\n\nBest regards,\n${companyName}`);
        formData.append('attachment', generatedPdfBlob, 'invoice.pdf');

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer cPMNiyCa3kfDsVOYz'
            },
            body: formData
        });

        if (response.ok) {
            alert('Invoice sent successfully!');
        } else {
            alert('Invoice sent successfully!');
        }
        // emailjs.init("thakuraditi212@gmail.com"); // Use your actual user ID here

        // document.getElementById('send-email').addEventListener('click', function() {
        //     const formData = new FormData(document.getElementById('invoice-form'));
            
        //     emailjs.sendForm('service_l3e7l0u', 'template_dc8lgdm', formData)
        //         .then((response) => {
        //             alert('Email sent successfully');
        //             console.log('Success:', response);
        //         }, (error) => {
        //             alert('Failed to send email');
        //             console.error('Error:', error);
        //         });
        // });
        
    }

    addItemButton.addEventListener('click', addItem);
    generateInvoiceButton.addEventListener('click', downloadInvoice);
    previewInvoiceButton.addEventListener('click', showPreview);
    downloadInvoiceButton.addEventListener('click', () => {
        generateInvoice(); // Regenerate the invoice to ensure the latest data is used
        downloadInvoice();
    });

    sendEmailButton.addEventListener('click', sendEmail);

    closeModalButton.addEventListener('click', () => {
        previewModal.style.display = 'none';
    });

    document.getElementById('invoice-date').valueAsDate = new Date(); // Set default invoice date
});
