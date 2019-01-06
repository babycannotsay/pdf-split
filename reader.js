const PFParser = require("pdf2json/pdfparser"); // doc: https://github.com/modesty/pdf2json

function forEachItem(pdf, handler, index) {
  const arr = [];
  for (var p in pdf.formImage.Pages) {
    var page = pdf.formImage.Pages[p];
    var item = page.Texts[index];
    const name = decodeURIComponent(item.R[0].T);
    arr.push(name);
  }
  handler(null, arr);
}

function Reader() {}

/**
 * parseBuffer: calls itemHandler(error, item) on each item parsed from the pdf file received as a buffer
 */
Reader.prototype.parseBuffer = function(pdfBuffer, itemHandler, index) {
  const pdfParser = new PFParser();
  pdfParser.on("pdfParser_dataError", itemHandler);
  pdfParser.on("pdfParser_dataReady", function(pdfData) {
    forEachItem(pdfData, itemHandler, index);
  });
  pdfParser.parseBuffer(pdfBuffer);
};

module.exports = Reader;
