import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";

import { auth } from "@/lib/firebase";
export default class UserRequest {
  static async login(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const errorMessage = error.message;
      throw new Error(errorMessage);
    }
  }
}
