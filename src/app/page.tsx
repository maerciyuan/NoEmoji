import ClientEmojiPanel from "@/app/client-emoji-panel";
import { cookies } from "next/headers";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { EMOJIS } from "@/app/emojis";
import { redirect } from "next/navigation";

export default async function Home() {
    const cookieStore = await cookies();
    const uid = cookieStore.get("uid");
    if (!uid) return redirect("/login");

    // TODO: Fetches emoji history for the user
    async function getEmojiHistory(): Promise<{ id: number, date: Date }[]> {
        const cookieStore = await cookies();
        const uid = cookieStore.get("uid");
        const token = cookieStore.get("token");
        // ...
        return [];
    }

    // TODO: Fetches all emoji records (only for super user)
    async function getGlobalEmojiHistory(): Promise<{ id: number, date: Date }[]> {
        return [];
    }

    const isSuper = true; // TODO: Check whether the user is super

    const emojiHistory = await getEmojiHistory();
    const emojiCount = new Map<number, number>();

    if (isSuper) {
        const emojis = await getGlobalEmojiHistory();
        for (const em of emojis) {
            const pre = emojiCount.get(em.id) ?? 0;
            emojiCount.set(em.id, pre + 1);
        }
    }

    return <Card>
        <Flex gap="8" p="8" align="center">
            <ClientEmojiPanel/>
            <div style={{ borderLeft: "1px solid gray", alignSelf: "stretch" }}></div>
            <Flex gap="5" direction="column" align="center" maxHeight="20em">
                <Heading>历史表情</Heading>
                {
                    emojiHistory.length === 0 ?
                        <Text color="gray">暂无表情</Text> :
                        <Flex px="5" gap="2" direction="column" minHeight="0" overflowY="auto">
                            {
                                emojiHistory.map(({ id, date }, i) =>
                                    <Flex key={i} align="center" gap="5">
                                        <Text size="4">{EMOJIS[id]}</Text>
                                        <Text size="2" color="gray">{date.toLocaleString()}</Text>
                                    </Flex>
                                )
                            }
                        </Flex>
                }
            </Flex>
            <div style={{ borderLeft: "1px solid gray", alignSelf: "stretch" }}></div>
            {
                isSuper &&
                <Flex gap="5" direction="column" align="center" maxHeight="20em">
                    <Heading>表情统计</Heading>
                    {
                        emojiCount.size === 0 ?
                            <Text color="gray">暂无表情</Text> :
                            <Flex px="5" gap="2" direction="column" minHeight="0" overflowY="auto">
                                {
                                    emojiCount.entries().map(([id, count]) =>
                                        <Flex key={id} align="center" gap="5">
                                            <Text size="4">{EMOJIS[id]}</Text>
                                            <Text size="2" color="gray">{count}</Text>
                                        </Flex>
                                    )
                                }
                            </Flex>
                    }
                </Flex>
            }
        </Flex>
    </Card>;
}
