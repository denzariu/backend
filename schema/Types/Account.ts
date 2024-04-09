import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql'

export const AccountType = new GraphQLObjectType({
  name: "Account",
  fields: () => ({
    id: { type: GraphQLID},
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString }
  })
})