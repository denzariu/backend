import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { ACCOUNT_EXISTS, CAN_LOGIN, GET_ALL_ACCOUNTS, MAIL_EXISTS } from './Queries/Account.ts' 
import { CREATE_ACCOUNT, DELETE_ACCOUNT, UPDATE_PASSWORD } from "./Mutations/Account.ts";
import { DECODE_TOKEN, ENCODE_TOKEN } from "./Queries/Secrets.ts";


const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllAccounts: GET_ALL_ACCOUNTS,
    canLogIn: CAN_LOGIN,
    accountExists: ACCOUNT_EXISTS,
    mailExists: MAIL_EXISTS,

    encodeToken: ENCODE_TOKEN,
    decodeToken: DECODE_TOKEN,
  }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation", 
  fields: {
    createAccount: CREATE_ACCOUNT,
    deleteAccount: DELETE_ACCOUNT,
    updateAccountPassword: UPDATE_PASSWORD
  }
})

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation 
})
