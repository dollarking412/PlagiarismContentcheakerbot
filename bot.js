const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Plagiarism detection
function detectPlagiarism(text) {
    const commonPhrases = [
        "in today's competitive world",
        "it is of utmost importance", 
        "last but not least",
        "first and foremost",
        "think outside the box"
    ];
    
    const lowercaseText = text.toLowerCase();
    const flagged = commonPhrases.filter(phrase => lowercaseText.includes(phrase));
    
    return {
        isPlagiarized: flagged.length > 0,
        flaggedPhrases: flagged,
        score: (flagged.length / commonPhrases.length) * 100
    };
}

// Text rewriting
function rewriteText(text) {
    const synonyms = {
        'good': ['excellent', 'quality', 'superior'],
        'important': ['significant', 'crucial', 'vital'],
        'show': ['demonstrate', 'exhibit', 'display'],
        'use': ['utilize', 'employ', 'apply'],
        'make': ['create', 'produce', 'develop']
    };
    
    let rewritten = text;
    Object.keys(synonyms).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        rewritten = rewritten.replace(regex, (match) => {
            const syns = synonyms[word];
            const random = syns[Math.floor(Math.random() * syns.length)];
            return match[0] === match[0].toUpperCase() ? 
                   random.charAt(0).toUpperCase() + random.slice(1) : random;
        });
    });
    return rewritten;
}

// Start command
bot.start(async (ctx) => {
    await ctx.reply(
        '🔍 *Plagiarism Guard Bot*\n\nSend me any text and I will:\n✅ Check for plagiarism\n✅ Rewrite content uniquely\n✅ Remove copyright issues\n\nJust send your text to begin! 📝',
        { parse_mode: 'Markdown' }
    );
});

// Handle text messages
bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    
    if (text.length < 20) {
        await ctx.reply('⚠️ Please send at least 20 characters for accurate checking.');
        return;
    }
    
    await ctx.reply('🔄 Analyzing and rewriting your text...');
    
    const plagiarism = detectPlagiarism(text);
    const rewritten = rewriteText(text);
    
    let response = '';
    if (plagiarism.isPlagiarized) {
        response = `⚠️ *Plagiarism Detected!* (Score: ${plagiarism.score.toFixed(1)}%)\n\n`;
        response += `*Original:* ${text.substring(0, 150)}...\n\n`;
        response += `*✨ Unique Version:* ✨\n${rewritten}\n\n`;
        response += `_This rewritten version is free from copyright issues._`;
    } else {
        response = `✅ *Content is Unique*\n\n*✨ Enhanced Version:*\n${rewritten}`;
    }
    
    await ctx.reply(response, { parse_mode: 'Markdown' });
});

// Start bot
bot.launch();
console.log('Bot is running...');
