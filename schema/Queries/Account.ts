//@ts-nocheck
/*
// Test data
const POSTS = [
  { author: "Haruki Murakami", book: 'Padurea norvegiana', body: "Hello DAY!" },
  { author: "Tatiana Tibuleac", book: "Vara in care mama a avut ochii verzi", body: "Hello SUMMER!"}
];



// Query is the main entry point for API consumer 
const schema = buildASTSchema(gql`
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }
  type Post {
    id: ID
    author: String
    book: String
    body: String
  }
`);

/*
  type Mutation {
    createPost(field: String): Post
    deletePost(field: String): String
  }


//@ts-ignore
const mapPost = (post, id) => post && ({ id, ...post });

const root = {
  posts: () => POSTS.map(mapPost),
  post: ({ id }) => mapPost(POSTS[id], id)
};

*/

import { GraphQLBoolean, GraphQLList, GraphQLString } from "graphql";
import { AccountType } from "../Types/Account.ts";
import { Accounts } from "../../entities/Accounts.ts";
import { JwtPayload, jwtDecode } from "jwt-decode";

export const GET_ALL_ACCOUNTS = {
  type: new GraphQLList(AccountType),
  resolve() {
    return Accounts.find();
  }
} 

export const ACCOUNT_EXISTS = {
  type: GraphQLBoolean,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  async resolve(parent: any, args: any) {
    console.log(parent)

    const { email, password } = args
    const user = await Accounts.findOneBy({email: email, password: password})

    if (user)
      return true

    return false
  }
} 

export const MAIL_EXISTS = {
  type: GraphQLBoolean,
  args: {
    email: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    console.log(parent)

    const { email } = args
    const user = await Accounts.findOneBy({email: email})

    if (user)
      return true

    return false
  }
} 


  /* 
    Log in by:  - Google sign in -> email + token check
                - Normal user -> email + pass
  */
export const CAN_LOGIN = {
  type: GraphQLBoolean,
  args: {
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    
    google_auth: { type: GraphQLString }
  },
  async resolve(parent: any, args: any) {
    console.log(parent)


    if (args.google_auth) { 
      // Check if credentials are valid
      const user_credential = jwtDecode<JwtPayload>(args.google_auth)
      const user_fetch = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${args.google_auth}`)
      
      // console.log('Fetched user: ', user_fetch, " CREDENTIALS: ", user_credential)

      // If error ==> deny
      //@ts-ignore
      if (!user_fetch.ok || user_fetch.error === "invalid_token") return false;

      // console.log('Fetching was ok. Checking exp... ')

      
      // If token is expired ==> deny
      //@ts-ignore
      if (user_fetch.exp < Date.now()) return false;
      

      // Search for user in DB
      //@ts-ignore
      const user = await Accounts.findOneBy({ email: user_credential.email })

      // console.log('Expiration date is ok. Checking if user exists in DB...', user)

      // if no user was found, it needs to be added
      if (!user) return false

      // console.log('User exists in DB. Testing if credential exists: ', !user_credential.exp, " and if its exp <= now ", user_credential.exp, ' < ', Date.now() / 1000)


      // if user logged in with a token, check valability
      if (!user_credential.exp || user_credential.exp <= Date.now() / 1000) return false
      else {
        // console.log('CAN LOG IN! ')

        return true
      }
    } else {
      const user = await Accounts.findOneBy({ email: args.email, password: args.password })

      // if no user was found ==> deny
      if (!user) return false

      // if credentials are not valid ==> deny
      if (args.password !== user.password) return false

      return true
    }
    

    
    
  }
}