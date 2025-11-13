const compliments = [
    "इतनी कचरा बातें छोड़ देता है कि बायोडिग्रेडेबल भी शर्मिंदा हो।",
    "Yar, uss rat tere baap ko chupchap so jana chahie tha.",
    "आसमान जितना नीला है, सूरजमुखी जितना पीला है,पानी जितना गीला है, आपका स्क्रू उतना ही ढीला है.",
    "शाम होते ही यह दिल उदास हो जाता है,टूटे हुए ख्वाबों के अलावा कुछ भी पास नहीं रहता..!तेरी याद तब सबसे ज़्यादा आती है,जब कोई बंदर आस-पास होता है.",
    "कमाल तेरे नखरे, कमाल का तेरा स्टाइल है,बात करने की तमीज़ नहीं, और हाथ में मोबाइल है.",
    "Phatele Nirodh Ke Natije!", 
    "Abla Naari, Tere Bable Bhaari",
    "You're like a cloud. When you disappear, it's a beautiful day!",
    "You bring everyone so much joy when you leave the room!",
    "I'd agree with you, but then we'd both be wrong.",
    "You're not stupid; you just have bad luck thinking.",
    "Your secrets are always safe with me. I never even listen to them.",
    "You're proof that even evolution takes a break sometimes.",
    "You have something on your chin... no, the third one down.",
    "You're like a software update. Whenever I see you, I think, 'Do I really need this right now?'",
    "You bring everyone happiness... you know, when you leave.",
    "You're like a penny—two-faced and not worth much.",
    "You have something on your mind... oh wait, never mind.",
    "You're the reason they put directions on shampoo bottles.",
    "You're like a cloud. Always floating around with no real purpose.",
    "Your jokes are like expired milk—sour and hard to digest.",
    "You're like a candle in the wind... useless when things get tough.",
    "You have something unique—your ability to annoy everyone equally.",
    "You're like a Wi-Fi signal—always weak when needed most.",
    "You're proof that not everyone needs a filter to be unappealing.",
    "Your energy is like a black hole—it just sucks the life out of the room.",
    "You have the perfect face for radio.",
    "You're like a traffic jam—nobody wants you, but here you are.",
    "You're like a broken pencil—pointless.",
    "Your ideas are so original, I'm sure I've heard them all before.",
    "You're living proof that even mistakes can be productive.",
    "You're not lazy; you're just highly motivated to do nothing.",
    "Your brain's running Windows 95—slow and outdated.",
    "You're like a speed bump—nobody likes you, but everyone has to deal with you.",
    "You're like a cloud of mosquitoes—just irritating.",
    "You bring people together... to talk about how annoying you are.",
    "Your existence is proof that the gods aren't perfect. They can obviously make horrendous mistakes.",
    "Don't let your mind wander - it's far too small to be let out on its own.",
    "I bet mind-readers only charge you half price.",
    "You have a face only a mother could love – and she hates it.",
    "If you're going to be two-faced, at least make one of them cute.",
    "Whatever is eating you must be suffering horribly.",
    "Earth is full. Go somewhere else.",
    "You're the human version of cramps.",
    "अंगेना गात्रम नयनेन वक्रतम न्यानेन राज्यम लवडेन भूज्यंम.",
];

async function complimentCommand(sock, chatId, message) {
    try {
        if (!message || !chatId) {
            console.log('Invalid message or chatId:', { message, chatId });
            return;
        }

        let userToCompliment;
        
        // Check for mentioned users
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToCompliment = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check for replied message
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToCompliment = message.message.extendedTextMessage.contextInfo.participant;
        }
        
        if (!userToCompliment) {
            await sock.sendMessage(chatId, { 
                text: 'Please mention someone or reply to their message to compliment them!'
            });
            return;
        }

        const compliment = compliments[Math.floor(Math.random() * compliments.length)];

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(chatId, { 
            text: `Hey @${userToCompliment.split('@')[0]}, ${compliment}`,
            mentions: [userToCompliment]
        });
    } catch (error) {
        console.error('Error in compliment command:', error);
        if (error.data === 429) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                await sock.sendMessage(chatId, { 
                    text: 'Please try again in a few seconds.'
                });
            } catch (retryError) {
                console.error('Error sending retry message:', retryError);
            }
        } else {
            try {
                await sock.sendMessage(chatId, { 
                    text: 'An error occurred while sending the compliment.'
                });
            } catch (sendError) {
                console.error('Error sending error message:', sendError);
            }
        }
    }
}

module.exports = { complimentCommand };
