
export type SignInRequest = {
    type: number,
    name: string,
    password: string,
}

export type SignInPayload = {
    expires: number,
    token: string,
}

export type InfoPayload = {
    id: string,
    profile: {
        id: string,
        nickname: string,
        email: string,
        avatar: string,
    },
    roles: string[],
}