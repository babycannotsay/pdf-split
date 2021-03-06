const path = require("path");
const fs = require("fs");
const Reader = require("./reader");
const paginate = require("./paginate.js");

fs.readFile(path.join(__dirname, "/test.pdf"), async (err, buffer) => {
  const index = await new Reader().getIndex(buffer, "唐**");

  new Reader().parseBuffer(
    buffer,
    (err, item) => {
      if (!err && item) {
        item.forEach((value, index) => {
          const buf = paginate(buffer, index);
          fs.writeFileSync(path.join(__dirname, `/${value}.pdf`), buf);
        });
      }
    },
    index /*position in pdf */
  );
});
