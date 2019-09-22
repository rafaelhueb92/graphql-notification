const { PubSub } = require("graphql-subscriptions");
const { produto } = require("../../core/db/models");
const pubsub = new PubSub();
const NOTIFICATION_SUBSCRIPTION_TOPIC = "Nova Notificação";
const db = require("../../core/db/db");
const objects = require("../../core/util/objects");
const { makeExecutableSchema } = require("graphql-tools");

db.abrirConexao().catch(error => console.log(error));

const typeDefs = `
  type produto {_id:ID,descricao:String estoque:Int}
  input produtoInput {descricao:String estoque:Int}
  type Query { Produto(id:ID): produto Produtos:[produto] }
  type Mutation { 
      incluirProduto(incluir: produtoInput!): produto 
      alterarProduto(alterar: produtoInput!): produto 
      excluirProduto(id:ID): produto 
  }
  type Subscription { newNotification: produto }
`;

const resolvers = {
  Query: {
    Produto: id => produto.findById(id),
    Produtos: () => produto.find({})
  },
  Mutation: {
    incluirProduto: (_, { incluir }) => {
      let Produto = new produto({ ...incluir });
      pubsub.publish(NOTIFICATION_SUBSCRIPTION_TOPIC, {
        newNotification: Produto
      });
      return Produto.save();
    },
    alterarProduto: (_, { alterar }) => {
      return produto.findById(args.id).then(result => {
        const produtoAlterar = objects.deparaObjetos({ ...alterar }, result);
        let Produto = new produto({ ...produtoAlterar });
        const subStr = JSON.stringify(Produto);
        pubsub.publish(NOTIFICATION_SUBSCRIPTION_TOPIC, { subStr });
        return Produto.save();
      });
    },
    excluirProduto: (_, args) => {
      return produto.remove({ _id: args.id }, err => {
        if (err) throw err;
        else {
          const subStr = args.id.toString();
          pubsub.publish(NOTIFICATION_SUBSCRIPTION_TOPIC, { subStr });
          return `produto id ${args.id} excluído com sucesso!`;
        }
      });
    }
  },
  Subscription: {
    newNotification: {
      subscribe: () => pubsub.asyncIterator([NOTIFICATION_SUBSCRIPTION_TOPIC])
    }
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = { schema };
