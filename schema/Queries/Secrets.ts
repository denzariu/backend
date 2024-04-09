import { GraphQLString } from "graphql";

function stringToNumberArray(inputString: string, n1: number, n2: number, n3: number): number[] {
  const numberArray: number[] = [];
  for (let i = 0; i < inputString.length; i++) {
      const charCode: number = inputString.charCodeAt(i);
      numberArray.push(((charCode * n1) + n2) * n3);
  }
  return numberArray;
}

function numberArrayToString(array: number[], n1: number, n2: number, n3: number): string {
  let str: string = '';
  for (let i = 0; i < array.length-1; i++) {
      str = str.concat(String.fromCharCode((array[i] / n3 - n2 ) / n1));
  }
  return str;
}

function stringifyArray(array: number[], delim: string): string {
  let str: string = '';
  for (let i = 0; i < array.length; i++) {
      str = str.concat(array[i] + delim);
  }
  return str;
}


// Before sending the user a cookie with a token, we'll encode user's token.
export const ENCODE_TOKEN = {
  type: GraphQLString,
  args: {
    session_token: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    console.log(parent)

    try {
      const { session_token } = args;

      //Split
      const T1 = session_token.slice(0, session_token.length / 2);
      const T2 = session_token.slice(session_token.length / 2, session_token.length)
      
      const NUM1 = stringToNumberArray(T1.slice(0, T1.length / 2), 2, 3, 3);
      const NUM2 = stringToNumberArray(T2.slice(0, T2.length / 2), 3, 4, 1);

      return (
        stringifyArray(NUM2, 's') 
        + '.' + T2.slice(T2.length / 2, T2.length) 
        + '.' + stringifyArray(NUM1, 't') 
        + '.' + T1.slice(T1.length / 2, T1.length) 
      )
    } catch (err) {
      console.log(err)
      return 'ERROR'
    }
  }
}

// Check user's token.
export const DECODE_TOKEN = {
  type: GraphQLString,
  args: {
    session_token: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    console.log(parent)

    try {
      const { session_token } = args;

      const split = session_token.split('.')

      const NUM2 = split[0]
      const fill2 = split[1]
      const NUM1 = split[2]
      const fill1 = split[3]

      const arr1 = NUM1.split('t')
      const arr2 = NUM2.split('s')
      
      return numberArrayToString(arr1, 2, 3, 3) + fill1 + numberArrayToString(arr2, 3, 4, 1) + fill2
    
    } catch (err) {
      console.log(err)
      return 'ERROR'
    }
    
  }
}