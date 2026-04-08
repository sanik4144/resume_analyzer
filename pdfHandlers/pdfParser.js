const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function extractCV() {
	const parser = new PDFParse({ url: './resume.pdf' });

	const result = await parser.getText();
    return result.text;
}

module.exports = {extractCV};