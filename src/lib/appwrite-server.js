"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Client,
  Account,
  OAuthProvider,
  Databases,
  Storage,
  ID,
} from "node-appwrite";
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const session = cookies().get(process.env.NEXT_SESSION_COOKIE);
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get db() {
      return new Databases(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
    .setKey(process.env.NEXT_APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get db() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    }
  };
}

export async function signUpWithGoogle() {
  const { account } = await createAdminClient();

  const origin = headers().get("origin");
  const successURL = `${origin}/oauth`;
  const failureURL = `${origin}/login`;
  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    successURL,
    failureURL
  );
  return redirect(redirectUrl);
}

export async function signOut() {
  const { account } = await createSessionClient();
  await account.deleteSessions();
  cookies().delete(process.env.NEXT_SESSION_COOKIE);
}

export async function getUser() {
  const { account } = await createSessionClient();
  const user = await account.get();
  return user;
}

export async function registerAttendee(data){
  console.log({data})
  try {
    // const user = await getUser();
    const { db } = await createSessionClient();
    const result = await db.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
      process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION,
      ID.unique(),
      {...data,name:"arnab",email:"user.email",authId:"user.$id",paymentScreenshot:"url"}
    );  
    return {success:true,id:result.$id}
  } catch (error) {
    console.log({error})
    return {success:false,id:""}
  }
}