# Scrap: A Multi-Functional Discord Bot

Scrap is a versatile Discord bot packed with features designed to enhance your server's functionality and engagement. It offers a diverse set of tools for both fun and utility, making it a valuable addition to any Discord community.

## Features

### Engagement

- Auto Roles: Automatically grant users roles upon joining

- Reaction Roles: Allow users to assign themselves roles based on reactions

- Leveling: Reward members' server involvement with a leveling system that users can progress in and earn rewards

- Counting: A counting management system that ensures users count in order and rewards users for engaging in the counting game

- Free Game Alerts: Stay informed about the latest free games, ensuring you never miss out on any deals

### Music

- Listen to music with your friends in any voice channel!

### Fun

- rps command: Challenge Scrap to a game of Rock, Paper, Scissors

### Utility

- info command: View information about the server or a specific user

- ping command: Check Scrap's responsiveness to ensure it is functioning smoothly

## Administrator Commands

### `/auto-roles (add-role|remove-role) <role> [<bot-only>]`

Configuration command for the auto roles system. Automatically grant roles to users upon them joining the server.

- `role`: The role to add/remove from auto roles.
- `bot-only`: Whether the role should only apply to bots. Auto roles are only applied to users by default.

### `/counting add-role-reward <role> <num-counts>`

Add a role reward to grant users upon counting a certain number of times.

- `role`: The role to be given to the user.
- `num-counts`: The number of times a user has to count in order to earn the role.

### `/counting clear-channel`

Removes the counting channel from the bot.

### `/counting remove-role-reward <role>`

Remove a role reward from the counting system.

- `role`: The role to remove.

### `/counting set-channel <channel>`

Sets the channel to use for counting.

- `channel`: The channel to use for counting.

### `/epic-free-games clear-channel`

Removes the free games channel from the bot.

### `/epic-free-games clear-role`

Removes the role the bot mentions for free games notifications.

### `/epic-free-games set-channel <channel>`

Sets the channel for free games notifications.

- `channel`: The channel for free games notifications.

### `/epic-free-games set-role <role>`

Sets the role to be mentioned in the free games notification.

- `role`: The role to be mentioned.

### `/leveling add-role-reward <role> <level>`

Add a role reward to grant users upon reaching a certain level.

- `role`: The role to reward.
- `level`: The level to grant the role at.

### `/leveling remove-role-reward <role>`

Remove a role reward from the leveling system.

- `role`: The role to remove.

### `/reaction-roles add <message-id> <emoji> <role>`

Add a reaction to a message for users to be granted a role with.

- `message-id`: The ID of the message to add the reaction to.
- `emoji`: The emoji to use for the reaction: This must be from a server the bot is in.
- `role`: The role to grant the user upon using the reaction.

- `message`: The message for the bot to send. If not provided the bot defaults to "React here to get your roles!"

### `/reaction-roles remove <message-id> <emoji>`

Remove a reaction from from a message.

- `message-id`: The ID of the message to remove the reaction from.

- `emoji`: The emoji of the reaction to remove.

### `/twitch add <username>`

Add stream alerts for a Twitch channel

- `username`: The username of the Twitch channel to add alerts for

### `/twitch clear-channel`

Remove the stream alerts channel

### `/twitch remove <username>`

Remove stream alerts for a Twitch channel

- `username`: The username of the Twitch channel to remove alerts for

### `/twitch set-channel <channel>`

Set the stream alerts channel

- `channel`: The channel to set for stream alerts

## Member Commands

### `/count [<user>]`

Get the number of times a user has counted.

- `user`: The user to get the number of counts of. If no user is provided, see how many times you have counted.

### `/level [<user>]`

Get a user's level.

- `user`: The user to view. If no user is provided, view your level.

### `/pause`

Pauses the current song.

### `/ping`

Replies with pong!

### `/play <song>`

Plays a song in the current voice channel or adds the song to a queue if another song is currently playing.

- `song`: The song to play

### `/queue`

Displays the current music queue. Can only display the first 25 songs in the queue.

### `/rps <choice>`

Play a game of Rock, Paper, Scissors with Scrap.

- `choice`: Your choice of rock, paper, or scissors, to play the game with.

### `/skip`

Skips the currently playing song.

### `/stop`

Stops the music and makes the bot leave the voice channel.

### `/unpause`

Resumes the current song.
