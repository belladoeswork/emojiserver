import { emojis } from "@/lib/emojis.js";
import { NextResponse } from "next/server.js";


//show emoji by id
export function GET(request, response) {

    const { emojiId } = response.params;
    const emoji = emojis.filter((emoji) => emoji.id === +emojiId)[0];
    if (!emoji) {
        return NextResponse.json({
            success: false,
            message: "No emoji with that ID found.",
        });
    }
    return NextResponse.json({ success: true, emoji });
}


//delete emoji
export function DELETE(request, response) {

    const { emojiId } = response.params;
    const emojiIndex = emojis.findIndex((emoji) => emoji.id === +emojiId);

    if (emojiIndex === -1) {
        return NextResponse.json({
            success: false,
            message: "Delete action not possible. No emoji with that ID found.",
        });
    }

    const deletedEmoji = emojis[emojiIndex];

    emojis.splice(emojiIndex, 1);

    return NextResponse.json({ 
        success: true,
        message: "Delete action successful.", 
        deletedEmoji 
    });  
}


//update emoji
export async function PUT(request, response) {


  const { emojiId } = response.params;
  const emojiIndex = emojis.findIndex((emoji) => emoji.id === +emojiId);

  if (emojiIndex === -1) {
    return NextResponse.json({
      success: false,
      message: "Update action not possible. No emoji with that ID found.",
    });
  }
  
  const updatedEmojiData = await request.json();

  let previousEmoji = { ...emojis[emojiIndex] };

  if (!updatedEmojiData.name || !updatedEmojiData.character) {
    return NextResponse.json({
      success: false,
      message: "Both name and character must be provided.",
    });
  }

  const emojiRegex = /^[\uD800-\uDBFF][\uDC00-\uDFFF]$/;
  if (!emojiRegex.test(updatedEmojiData.character)) {
    return NextResponse.json({
      success: false,
      message: "Invalid emoji character.",
    });
  }
  
  if (
    updatedEmojiData.character === previousEmoji.character &&
    updatedEmojiData.name === previousEmoji.name
  ) {
    return NextResponse.json({
      success: false,
      message: "Emoji is already updated with the provided data.",
    });
  }

  const updatedEmoji = {
    id: previousEmoji.id,
    character: updatedEmojiData.character,
    name: updatedEmojiData.name,
  };
  
  emojis[emojiIndex] = updatedEmoji;

  return NextResponse.json({
    success: true,
    message: "Emoji update successful.",
    previousEmoji,
    updatedEmoji,
  });
}