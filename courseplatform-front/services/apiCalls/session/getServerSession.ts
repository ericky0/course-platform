import { AxiosError } from "axios";

import { UserResponse } from "@/types/UserResponse";
import api from "@/services/api";
import cookieStore from "@/hooks/getCookies";


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