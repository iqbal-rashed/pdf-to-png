const fs = require("fs/promises");
const NodeCanvasFactory = require("./utils/NodeCanvasFactory");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const pdfToPng = async (pdfBuffer) => {
    const pdfDocument = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
    const page = await pdfDocument.getPage(1);
    // Render the page on a Node canvas with 100% scale.
    const viewport = page.getViewport({ scale: 1.0 });
    const canvasFactory = new NodeCanvasFactory();
    const canvasAndContext = canvasFactory.create(
        viewport.width,
        viewport.height
    );
    const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport,
        canvasFactory,
    };
    const renderTask = page.render(renderContext);
    await renderTask.promise;
    return canvasAndContext.canvas.toBuffer();
};

(async () => {
    const pdfBuffer = await fs.readFile("test.pdf");
    const imageBuffer = await pdfToPng(pdfBuffer);
    await fs.writeFile("output.png", imageBuffer);
})();
