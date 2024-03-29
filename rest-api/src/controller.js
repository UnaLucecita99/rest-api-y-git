import {pool} from './database.js';

class LibrosController{
    async getAll(req, res){
        try {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    } catch (error){
        res.status(500).json({"Error": "Ocurrió un error al obtener los libros" });
    }
}
    
    async getOne(req, res) {
        try {
            const libro=req.body;
            const [result]= await pool.query('select * from libros WHERE ISBN=?', [libro.ISBN]);
            if (result.lenght > 0) {
                res.json(result[0]);
            }else{
            res.status(404).json({"Error": "No se encontró ningún libro con el ISBN ${libro.ISBN}"});
            }
        } catch (error){
            res.status(500).json({"Error": "Ocurrió un error al obtener el libro" });
        }
    }

    async add(req, res){
        const libro = req.body;
        //fix subida de atributos inválidos
        const listaAtributos = ['nombre', 'autor', 'categoria', 'añoPublicacion', 'ISBN'];
        const atributosExtra = Object.keys(libro).filter(attr => !listaAtributos.includes(attr));

        if (atributosExtra.length > 0) {
            return res.json({ error: `Atributos invalidos: ${atributosExtra.join(' , ')}`});
        }
        try {    
        const [result] = await pool.query(`INSERT INTO Libros (nombre, autor, categoria, añoPublicacion, ISBN) VALUES (?,?,?,?,?)`[libro.nombre, libro.autor, libro.categoria, libro.añoPublicacion, libro.ISBN]);
        res.json({ "ID insertado": result.insertId, "message": "Libro insertado exitosamente" });
    } catch (error){
        res.status(500).json({"Error": "Ocurrió un error al agregar el libro" });
        }
    }

    async deleteISBN(req,res){
    try {
        const libro = req.body;
        const [result] = await pool.query(`DELETE FROM Libros WHERE ISBN=(?)`, [libro.ISBN]);
        if(result.affectedRows > 0) {
        res.json({ "message": 'Libro con ISBN ${libro.ISBN} eliminado exitosamente'});
    }else {
        res.status(404).json({"Error": `No se encontró ningún libro con el ISBN ${libro.ISBN}`});
    }
    } catch (error){
        res.status(500).json({"Error": "Ocurrió un error al eliminar el libro" });
        }
    }

    async deleteID(req,res){
    try {
        const libro = req.body;
        const [result] = await pool.query(`DELETE FROM Libros WHERE id=(?)`, [libro.id]);
        if(result.affectedRows > 0) {
            res.json({ "message": `Libro con ID ${libro.id} eliminado exitosamente`});
        }else {
            res.status(404).json({"Error": `No se encontró ningún libro con el ID ${libro.id}`});
        }
    } catch (error){
        res.status(500).json({"Error": "Ocurrió un error al eliminar el libro" });
        }
    }    

    async update(req, res){
    try {
        const libro = req.body;
        const [result] = await pool.query (`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), año =(?), WHERE ISBN=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.año, libro.ISBN]);
        if(result.affectedRows > 0) {
            res.json({ "message": `Libro con ISBN ${libro.ISBN} eliminado exitosamente`});
        }else {
            res.status(404).json({"Error": `No se encontró ningún libro con el ISBN ${libro.ISBN}`});
        }
    } catch (error){
        res.status(500).json({"Error": "Ocurrió un error al eliminar el libro" });
        }
    }
}

export const libro = new LibrosController();