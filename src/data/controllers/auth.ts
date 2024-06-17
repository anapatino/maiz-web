import { UserCredential } from "firebase/auth";
import UserRequest from "../repository/user_request";

export class AuthService {
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      return await UserRequest.login(email, password);
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage === "INVALID_EMAIL") {
        throw new Error("Correo electronico no valido");
      }
      if (errorMessage === "INVALID_LOGIN_CREDENTIALS") {
        throw new Error("Credenciales de acceso de validas");
      }
      throw new Error("Ha ocurrido un error al ingresar");
    }
  }
}
