import { AxiosError } from "axios"
import { User } from "./User"

export interface UserResponse {
    user: User | null,
    error: AxiosError | null
}