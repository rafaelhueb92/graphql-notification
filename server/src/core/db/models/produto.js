const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema(
  {
    descricao: String,
    estoque: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Produto", ProdutoSchema);
