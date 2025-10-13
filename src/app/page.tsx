import ClientEmojiPanel from "@/app/client-emoji-panel";
import { cookies } from "next/headers";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { EMOJIS } from "@/app/emojis";

export default async function Home() {
    // TODO: Fetches emoji history for the user
    async function getEmojiHistory(): Promise<{ id: number, date: Date }[]> {
        const cookieStore = await cookies();
        const uid = cookieStore.get("uid");
        const token = cookieStore.get("token");
        // ...
        return [];
    }

    const emojiHistory = await getEmojiHistory();

    return <Card>
        <Flex gap="8" p="8" align="center">
            <ClientEmojiPanel/>
            <div style={{ borderLeft: "1px solid gray", alignSelf: "stretch" }}></div>
            <Flex gap="5" direction="column" align="center" maxHeight="20em">
                <Heading>历史表情</Heading>
                {
                    emojiHistory.length === 0 ?
                        <Text color="gray">暂无表情</Text> :
                        <Flex px="5" gap="2" direction="column" minHeight="0" overflowY="scroll">
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
        </Flex>
    </Card>;
}
