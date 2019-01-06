const hummus = require("hummus");
const fs = require("fs");
const streams = require("memory-streams");
const PDFRStreamForBuffer = require("./pdf-to-stream.js");

const getFirstPage = function(buffer, index = 0) {
  //Creating a stream, so hummus pushes the result to it
  let outStream = new streams.WritableStream();
  //Using PDFStreamForResponse to be able to pass a writable stream
  let pdfWriter = hummus.createWriter(
    new hummus.PDFStreamForResponse(outStream)
  );

  //Using our custom PDFRStreamForBuffer adapter so we are able to read from buffer
  let copyingContext = pdfWriter.createPDFCopyingContext(
    new PDFRStreamForBuffer(buffer)
  );
  //Get the first page.
  copyingContext.appendPDFPageFromPDF(index);

  //We need to call this as per docs/lib examples
  pdfWriter.end();

  //Here is a nuance.
  //HummusJS does it's work SYNCHRONOUSLY. This means that by this line
  //everything is written to our stream. So we can safely run .end() on our stream.
  outStream.end();

  //As we used 'memory-stream' and our stream is ended
  //we can just grab stream's content and return it
  return outStream.toBuffer();
};

//Getting the buffer from disk (sync just for demo purpose)
// let pdfBuffer = fs.readFileSync("工资明细2018.12_测试.pdf");

// let firstPageBuffer = getFirstPage(pdfBuffer, index);

//I wrote it back to disk for testing
// fs.writeFileSync(path.join(__dirname, "/result.pdf"), firstPageBuffer);
module.exports = getFirstPage;
