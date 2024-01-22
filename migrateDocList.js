import migrate from "./migrateOneDoc.js";
import fs from 'fs';
const text = fs.readFileSync("./toImport.txt", "utf-8");
const textByLine = text.split("\n")

textByLine.forEach(doc => {
    const dashPos = doc.lastIndexOf("-");
    const slashPos = doc.lastIndexOf("/");

    let docId = doc;
    if (dashPos > 0) {
        docId = doc.substring(dashPos+1);
    } else if (slashPos > 0) {
        docId = doc.substring(slashPos+1);
    }

    migrate(docId);
})