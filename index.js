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
		const path = __dirname + `/${nombreArchivo}`;

		if (req.url.includes("/crear")) {
			if (fs.existsSync(path)) {
				res.write(`Archivo con nombre "${nombreArchivo}" ya existe, por ende no se puede crear.`);
				res.end();
			} else {
				fs.writeFile(nombreArchivo, `${formattedDate} - ${contenido}`, () => {
					res.write(`Archivo con nombre "${nombreArchivo}" ha sido creado con exito.`);
					res.end();
				});
			}
		}
		if (req.url.includes("/leer")) {
			fs.readFile(nombreArchivo, (err, data) => {
				if (nombreArchivo && data !== undefined) {
					res.write(`Archivo existe.\n`);
					res.write(`Archivo con nombre "${nombreArchivo}" tiene como contenido: ${data}`);
				} else {
					res.write(`Archivo con nombre "${nombreArchivo}" no existe.`);
				}
				res.end();
			});
		}
		if (req.url.includes("/renombrar")) {
			if (fs.existsSync(path)) {
				fs.rename(nombreArchivo, nuevoNombre, (err, data) => {
					res.write(`Archivo "${nombreArchivo}" ha sido renombrado con exito, su nuevo nombre es "${nuevoNombre}".`);
					res.end();
				});
			} else {
				res.write(`Archivo con el nombre "${nombreArchivo}" no existe, por ende no se puede renombrar.`);
				res.end();
			}
		}
		if (req.url.includes("/eliminar")) {
			if (fs.existsSync(path)) {
				fs.unlink(nombreArchivo, (err, data) => {
					res.write(`Archivo con el nombre "${nombreArchivo}" ha sido eliminado con exito.`);
					res.end();
				});
			} else {
				res.write(`Archivo con el nombre "${nombreArchivo}" no existe, por ende no se puede eliminar.`);
				res.end();
			}
		}
	})
	.listen(8080, () => console.log("Server on"));
