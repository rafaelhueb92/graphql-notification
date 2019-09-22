const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const db = require("../core/db/db");
const graphql = require("graphql");
const objects = require("../core/util/objects");
const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt
} = graphql;
const { produto } = require("../core/db/models/index");

db.abrirConexao().catch(error => console.log(error));

const _produto = {
  descricao: { type: GraphQLString },
  estoque: { type: GraphQLInt }
};

const produtoType = new GraphQLObjectType({
  name: "Produto",
  description: "Entidade com as informações do Produto",
  fields: () => ({ _id: { type: GraphQLID }, ..._produto })
});

const query = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    produto: {
      type: produtoType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id }) {
        return produto.findById(id);
      }
    },
    produtos: {
      type: new GraphQLList(produtoType),
      resolve(_, a, { token }) {
        return produto.find({});
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    incluirProduto: {
      type: produtoType,
      args: { ..._produto },
      resolve(_, args) {
        let Produto = new produto({ ...args });
        pubsub.publish("Novo Produto", { Produto });
        return Produto.save();
      }
    },
    alterarProduto: {
      type: produtoType,
      args: { id: { type: GraphQLID }, ..._produto },
      resolve(_, args) {
        return produto.findById(id).then(result => {
          const produtoAlterar = objects.deparaObjetos({ ...args }, result);
          let Produto = new produto({ ...produtoAlterar });
          return Produto.save();
        });
      }
    },
    excluirProduto: {
      type: new GraphQLObjectType({
        name: "retornoprodutoExcluido",
        fields: { resposta: { type: GraphQLString } }
      }),
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return produto.remove({ _id: args.id }, err => {
          if (err) throw err;
          else return `produto id ${args.id} excluído com sucesso!`;
        });
      }
    }
  }
});

const subscription = new GraphQLObjectType({
  name: "Subscription",
  fields: {
    newNotification: {
      resolve() {
        return pubsub.asyncIterator("Novo Produto");
      }
    }
  }
});

module.exports = new GraphQLSchema({ query, mutation, subscription });
