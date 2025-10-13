"use server";

/**
 * Called when the user tries to log in/register with provided username and password.
 */
export async function loginOrRegister(user: string, pwd: string) {

}

/**
 * Called when the browser needs to load user info.
 */
export async function getUserInfo(): Promise<UserInfo> {
    return {
        name: "root",
        tel: "1234567890A",
        email: "me@example.com",
        super: true
    };
}

export interface UserInfo {
    name: string;
    tel: string;
    email: string;
    super: boolean;
}