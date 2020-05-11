export default async function help(message) {
  message.reply(`The following commands are currently available:
  
- \`!bfhelp\` - View this message
- \`!vs @Player\` - Challenge a player to a battle
- \`!rating\`, \`!rank\` - Get your current rating and leaderboard rank
- \`!rating @Player\`, \`!rank @Player\` - Get a player's current rating and leaderboard rank
`);
}
