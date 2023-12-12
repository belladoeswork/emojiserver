import { emojis } from "@/lib/emojis.js";
import { NextResponse } from "next/server.js";

export function GET() {

    return NextResponse.json({ success: true, emojis });
}

// create emoji
export async function POST(request, response) {

    try {
        const { character, name } = await request.json();
        if (!character  || !name) {
            return NextResponse.json({
                success: false,
                error: "Please proide both character and name to create an emoji.",
            });
        }

        const emojiRegex = /^[\uD800-\uDBFF][\uDC00-\uDFFF]$/;
        if (!emojiRegex.test(character)) {
            return NextResponse.json({
                success: false,
                error: "Invalid emoji character.",
            });
        }

        if (emojis.some((emoji) => emoji.name === name || emoji.character === character)) {
            return NextResponse.json({
              success: false,
              error: "Emoji with the same name or character already exists.",
            });
        }


        const emoji = { id: emojis.length + 1, character, name };

        emojis.push(emoji);
        return NextResponse.json({ success: true, emoji });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}