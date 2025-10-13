"use server";

import { cookies } from "next/headers";

/**
 * Called when the user attempts to submit an emoji. The ID of that emoji is passed.
 */
export async function submitEmoji(id: number) {
    // Reference implementation of getting user credentials
    const cookieStore = await cookies();
    const uid = cookieStore.get("uid");
    const token = cookieStore.get("token");

    // TODO: Verify JWT

    // TODO: Validate user and send emoji data
}

/**
 * Called when the user attempts to update their password.
 */
export async function updatePwd(newPwd: string) {

}


/**
 * Called when the user attempts to log out.
 */
export async function logout() {
}
