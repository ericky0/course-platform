import cookieStore from "@/hooks/getCookies";
import api from "@/services/api";
import { UserResponse } from "@/types/UserResponse";
import { AxiosError } from "axios";


export async function getServerSession(): Promise<UserResponse> {

  const cookies = cookieStore()

  try {
    const response = await api.get('/auth/session', {
      headers: {
        Cookie: `${cookies}`
      }
    })

    return {
      user: response.data,
      error: null
    }
  } catch (e) {
    const error = e as AxiosError
    return {
      user: null,
      error,
    }
  }
}