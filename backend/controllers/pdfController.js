const PDFDocument = require('pdfkit');

exports.generarCotizacion = async (req, res) => {
    try {
        const { productos, total } = req.body; // Recibimos la lista de productos y el total

        const doc = new PDFDocument({ margin: 50 });

        // Configurar respuesta del navegador
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=cotizacion.pdf');

        doc.pipe(res);

        // --- DISEÑO DEL PDF ---
        doc.fontSize(20).text('REMODELA-IA: Cotización Oficial', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`);
        doc.text(`Cliente: Usuario Registrado`);
        doc.moveDown();
        doc.path('M 50 150 L 550 150').stroke(); // Línea divisoria
        doc.moveDown();

        // --- ENCABEZADO DE TABLA ---
        doc.font('Helvetica-Bold').text('Producto', 50, 170);
        doc.text('Detalle', 400, 170);
        doc.moveDown();
        doc.font('Helvetica');

        // --- LISTADO DE PRODUCTOS DINÁMICO ---
        let yPos = 190;
        productos.forEach(item => {
            doc.text(item.nombre, 50, yPos);
            doc.text(item.precio, 400, yPos);
            yPos += 20; // Bajamos la posición para el siguiente producto
        });

        // --- TOTAL FINAL ---
        doc.moveDown(2);
        doc.font('Helvetica-Bold').fontSize(16)
           .text(`TOTAL: $${total}`, { align: 'right' });

        doc.end();

    } catch (error) {
        console.error("Error PDF:", error);
        res.status(500).send("Error al generar el documento");
    }
};