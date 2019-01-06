const PFParser = require("pdf2json/pdfparser"); // doc: https://github.com/modesty/pdf2json

function forEachItem(pdf, handler, index) {
  const arr = [];
  pdf.formImage.Pages.forEach(page => {
    const item = page.Texts[index];
    const name = decodeURIComponent(item.R[0].T);
    arr.push(name);
  });
  handler(null, arr);
}

function getIndex(pdf, keyword) {
  const promise = new Promise(resolve => {
    pdf.formImage.Pages.some(page => {
      const index = page.Texts.findIndex(item => {
        return decodeURIComponent(item.R[0].T) === keyword;
      });
      if (index !== -1) {
        resolve(index);
        return true;
      }
      return false;
    });
  });
  return promise;
}

function Reader() {}

/**
 * parseBuffer: calls itemHandler(error, item) on each item parsed from the pdf file received as a buffer
 */
Reader.prototype.parseBuffer = (pdfBuffer, itemHandler, index) => {
  const pdfParser = new PFParser();
  pdfParser.on("pdfParser_dataError", itemHandler);
  pdfParser.on("pdfParser_dataReady", pdfData => {
    forEachItem(pdfData, itemHandler, index);
  });
  pdfParser.parseBuffer(pdfBuffer);
};

Reader.prototype.getIndex = (pdfBuffer, keyword) => {
  const promise = new Promise(resolve => {
    const pdfParser = new PFParser();
    pdfParser.on("pdfParser_dataError", () => {
      throw new Error("pdfParser_dataError");
    });
    pdfParser.on("pdfParser_dataReady", async pdfData => {
      resolve(getIndex(pdfData, keyword));
    });
    pdfParser.parseBuffer(pdfBuffer);
  });
  return promise;
};

module.exports = Reader;
