import { apiBase } from "@/config/api";

export async function doSignIn(name: string, password: string) {
    const data = {
        type: 1,
        name,
        password,
    }

    const response = await fetch(`${apiBase}/auth/signIn`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (response.status === 200) {
        return response.json()
    } else if (response.status === 401) {
        return undefined
    }
}