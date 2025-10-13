"use server";

/**
 * Called when the user tries to log in.
 */
export async function login(user: string, pwd: string) {

}

/**
 * Called when the user tries to register.
 */
export async function register(ui: Omit<UserInfo, "uid" | "super">, user: string, pwd: string) {

}

/**
 * Called when the browser needs to load user info.
 */
export async function getUserInfo(): Promise<UserInfo> {
    return {
        uid: "0",
        name: "root",
        tel: "1234567890A",
        email: "me@example.com",
        super: true
    };
}

/**
 * Called when the browser needs information about all users.
 */
export async function getAllUsers(): Promise<UserInfo[]> {
    return [
        {
            uid: "0",
            name: "root",
            tel: "1234567890A",
            email: "me@example.com",
            super: true
        },
        {
            uid: "1",
            name: "me",
            tel: "1234567890A",
            email: "me@example.com",
            super: false
        }
    ];
}

/**
 * Called when the user info needs to be updated.
 */
export async function updateUser(ui: UserInfo) {

}

export interface UserInfo {
    uid: string;
    name: string;
    tel: string;
    email: string;
    super: boolean;
}