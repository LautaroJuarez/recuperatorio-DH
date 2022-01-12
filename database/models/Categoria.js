module.exports = (sequelize, DataTypes) => {
  let cols = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: {
      type: DataTypes.STRING,
    },
  };

  let config = {
    tablename: "categorias",
    timestamps: false,  };

  const Categoria = sequelize.define("Categorias", cols, config);


  return Categoria;
};
