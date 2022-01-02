const http = require("http");
const url = require("url");
const fs = require("fs");

const today = new Date();
const day = `${today.getDate() < 10 ? "0" : ""}${today.getDate()}`;
const month = `${today.getMonth() + 1 < 10 ? "0" : ""}${today.getMonth() + 1}`;
const year = today.getFullYear();
const formattedDate = `${day}-${month}-${year}`;

http
	.createServer(function (req, res) {
		const params = url.parse(req.url, true).query;
		const nombreArchivo = params.archivo;
		const nuevoNombre = params.nuevoNombre;
		const contenido = params.contenido;
		if (req.url.includes("/crear")) {
			fs.writeFile(nombreArchivo, `${formattedDate} -${contenido}`, () => {
				res.write(`Archivo ${nombreArchivo} ha sido creado con exito.`);
				res.end();
			});
		}
		if (req.url.includes("/leer")) {
			fs.readFile(nombreArchivo, (err, data) => {
				res.write(`Archivo ${nombreArchivo} tiene como contenido: ${data}.`);
				// res.write(data);
				res.end();
			});
		}
		if (req.url.includes("/renombrar")) {
			fs.rename(nombreArchivo, nuevoNombre, (err, data) => {
				res.write(`Archivo ${nombreArchivo} ha sido renombrado por ${nuevoNombre}.`);
				res.end();
			});
		}
		if (req.url.includes("/eliminar")) {
			fs.unlink(nombreArchivo, (err, data) => {
				res.write(`Archivo ${nombreArchivo} ha sido eliminado con exito.`);
				res.end();
			});
		}
	})
	.listen(8080, () => console.log("Server on"));
