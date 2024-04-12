import { GraphQLID, GraphQLString } from "graphql";
import { Accounts } from "../../entities/Accounts.ts";
import { ResponseType } from "../Types/Response.ts";
import { JwtPayload, jwtDecode } from "jwt-decode";

 export const CREATE_ACCOUNT = {
  type: ResponseType,
  args: {
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    credential: { type: GraphQLString }
  },
  async resolve(parent: any, args: any): Promise<typeof args> {    
    
    // If user used JWT to log in
    if (args.credential) {

      // Check if credentials are valid
      const user_credential = jwtDecode<JwtPayload>(args.credential)
      const user_fetch = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${args.credential}`)
      
      // If error ==> deny signup
      //@ts-ignore
      if (!user_fetch.ok || user_fetch.error === "invalid_token") return {successful: false, message: 'Token is invalid.'};
      
      // If token is expired ==> deny
      //@ts-ignore
      if (user_fetch.exp < Date.now()) return {successful: false, message: 'Token is expired.'};
      
      // Search for user in DB
      //@ts-ignore
      const user = await Accounts.findOneBy({ email: user_credential.email })

      // If user was found, deny signup
      if (user) return {successful: false, message: "Mail already used. Log in."}
      else {
        await Accounts.insert({
          //@ts-ignore
          email: user_credential.email,
          token: args.credential,
          //@ts-ignore
          picture_url: user_credential.picture,
          //@ts-ignore
          first_name: user_credential.given_name,
          //@ts-ignore
          last_name: user_credential.family_name
        });
        return {successful: true, message: "Account created successfully using Google."}
      }


    // If user used traditional log in method
    } else {

      if (!args.email || !args.password) return {successful: false, message: "Email and/or password were not provided."}

      const user = await Accounts.findOneBy({email: args.email})
      
      if (user) return {successful: false, message: "Mail already used. Log in."}
      else {
        await Accounts.insert({
          first_name: args.given_name,
          last_name: args.family_name,
          email: args.email,
          password: args.password
        });
        return {successful: true, message: "Account created successfully."}
      }
    }
  },
 };

 export const DELETE_ACCOUNT = { 
  type: ResponseType,
  args: {
    id: { type: GraphQLID }
  },
  async resolve(parent: any, args: any) {
    const id = args.id
    await Accounts.delete(id)
    
    return {successful: true, message: 'DELETED ACCOUNT SUCCESSFULLY'}
  }
 } 

 export const UPDATE_PASSWORD = {
  type: ResponseType,
  args: {
    email: { type: GraphQLString },
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString }
  },
  async resolve(parent: any, args: any) {
    console.log(args, parent)

    const {email, oldPassword, newPassword} = args
    const user = await Accounts.findOneBy({email: email})

    if (!user) throw new Error("USER_DOES_NOT_EXIST")
    const userPassword = user?.password

    if (oldPassword === userPassword) {
      await Accounts.update({email: email}, {password: newPassword})
      return {successful: true, message: 'PASSWORD UPDATED'}
    } else {
      throw new Error("PASSWORDS_NO_MATCH")
    }
  }
 }