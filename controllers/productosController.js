const db = require("../database/models");
const Sequelize = require("sequelize");
const { log } = require("debug");
const { Op } = require("sequelize");

module.exports = {
  detalle: function (req, res) {
    let id = req.params.id;
    db.Producto.findByPk(id, {
      include: [{ all: true, nested: true }],
    })
      .then(function (unProducto) {
        res.render("detalle", {
          unProducto: unProducto,
          title: unProducto.nombre,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  porCategoria: function (req, res) {
    let categoria = req.params.laCategoria;
    db.Producto.findAll({
      where: {
        categoria_id: categoria,
      },
      include: [
        {
          association: "categorias",
        },
      ],
    }).then(function (resultado) {
      res.render("porCategoria", {
        resultado: resultado,
        title: resultado[0].categorias.nombre,
      });
    });
  },

  buscar: function (req, res) {
    let buscar = req.query.busqueda.toLowerCase();
    db.Producto.findAll({
      where: {
        nombre: {
          [Op.substring]: buscar,
        },
      },
    }).then((resultados) => {
      res.render("resultadoBusqueda", {
        resultados,
      });
    });
  },

  agregarComentario: function (req, res) {
    if (req.session.usuarioLogueado == undefined) {
      res.redirect("/");
    }
    let idProducto = req.params.id;
    let idUsuario = req.session.usuarioLogueado.id;

    db.Comentario.create({
      texto_comentario: req.body.texto_comentario,
      calificacion: req.body.calificacion,
      usuario_id: idUsuario,
      producto_id: idProducto,
    }).then(function () {
      res.redirect("/productos/detalle/" + idProducto);
    });
  },

  agregarProducto: function (req, res) {
    if (req.session.usuarioLogueado == undefined) {
      res.redirect("/");
    }
    res.render("agregarProducto", { title: "Agregar Producto" });
  },

  productoSubmit: function (req, res) {
    if (req.session.usuarioLogueado == undefined) {
      res.redirect("/");
    }

    console.log(req.body);
    db.Producto.create({
      nombre: req.body.nombre,
      marca: req.body.marca,
      img_url: req.body.imagen,
      precio: req.body.precio,
      usuario_id: req.session.usuarioLogueado.id,
      categoria_id: req.body.categoria,
    }).then(() => {
      res.redirect("/");
    });
  },

  misProductos: function (req, res) {
    if (req.session.usuarioLogueado == undefined) {
      res.redirect("/");
    }

    db.Producto.findAll({
      where: { usuario_id: req.session.usuarioLogueado.id },
      order: [["updatedAt", "DESC"]],
    }).then(function (productos) {
      res.render("misProductos", {
        productos: productos,
        title: "Mis productos",
      });
    });
  },

  editarProducto: function (req, res) {
    if (req.session.usuarioLogueado == undefined) {
      res.redirect("/");
    }
    let id = req.params.id;
    db.Producto.findByPk(id).then(function (producto) {
      res.render("editarProducto", {
        producto: producto,
        title: "Editar producto",
      });
    });
  },

  editarConfirm: function (req, res) {
    if (req.session.usuarioLogueado == undefined) {
      res.redirect("/");
    }

    let id = req.params.id;
    db.Producto.update(req.body, {
      where: {
        id: id,
      },
    }).then(function (output) {
      res.redirect("/productos/misProductos");
    });
  },

  borrarProducto: function (req, res) {
    if (req.session.usuarioLogueado == undefined) {
      res.redirect("/");
    }
    let id = req.params.id;
    db.Producto.findByPk(id).then(function (producto) {
      res.render("borrarProducto", {
        producto: producto,
        title: "Borrar producto",
      });
    });
  },

  borrarConfirm: function (req, res) {
    if (req.session.usuarioLogueado == undefined) {
      res.redirect("/");
    }
    let id = req.params.id;
    db.Producto.destroy({
      where: {
        id: id,
      },
    }).then(function (otuput) {
      res.redirect("/productos/misProductos");
    });
  },
};
