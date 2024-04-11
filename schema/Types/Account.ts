import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql'

export const AccountType = new GraphQLObjectType({
  name: "Account",
  fields: () => ({
    id: { type: GraphQLID},

    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },

    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString }
  })
})