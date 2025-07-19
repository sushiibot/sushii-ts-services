---
title: Tags Guide
description: How to create and use custom commands with tags
---

## Getting Started

Tags are custom commands that let you create quick responses for frequently used
messages. They're perfect for storing common answers, server rules, helpful
links, or any content you want to quickly access with a simple command.

### Creating Your First Tag

Use the `/tag-add` command to create a new tag:

```
/tag-add name:welcome content:Welcome to our server! Please read the rules.
```

- **Name**: Must be 1-32 characters long (case-insensitive)
- **Content**: The text that will be displayed when the tag is used
- **Attachment**: Optional image attachment

You must provide either content, an attachment, or both.

Tags must be unique per server, and names are automatically converted to
lowercase.

:::note
`/tag-add` is a separate command from `/tag`, which is used to manage tags. This
allows you to limit permissions on who can create tags vs who can use them.
:::

### Using Tags

Once created, use tags with the `/t` command:

```
/t name:welcome
```

Using tags use this short command to be quicker to type.

:::tip
Since it's a separate command, you can also limit permissions on who can use
tags, separate from the tag management commands.
:::

## Tag Management

### Viewing Tag Information

Get detailed information about a tag with `/tag info`:

```
/tag info name:welcome
```

This shows:
- Tag content
- Creation date
- Owner
- Usage count
- Last used date

### Editing Tags

You can only edit tags you own, or if you have the "Manage Guild" permission.

#### Quick Edit Interface

Use `/tag edit` to open an interactive editing interface:

```
/tag edit name:welcome
```

This provides buttons to:
- **Edit Content**: Modify the tag's text content
- **Rename**: Change the tag's name
- **Delete**: Remove the tag entirely

#### Direct Rename

Quickly rename a tag using `/tag rename`:

```
/tag rename name:welcome new_name:server-welcome
```

#### Direct Delete

Delete a tag using `/tag delete`:

```
/tag delete name:welcome
```

## Finding Tags

### List All Tags

View all server tags with pagination:

```
/tag list
```

### Search Tags

Find specific tags using various filters:

```
/tag search name_starts_with:rule
/tag search name_contains:help
/tag search owner:@username
```

Search options:
- **name_starts_with**: Find tags beginning with specific text
- **name_contains**: Find tags containing specific text
- **owner**: Find tags created by a specific user

**Note:** You cannot combine `name_starts_with` and `name_contains` in the same search.

### Random Tags

Get a random tag, optionally with filters:

```
/tag random
/tag random name_starts_with:fun
/tag random owner:@username
```

## Permissions

### Regular Users
- Create tags with `/tag-add`
- Edit and delete their own tags
- Use any tag in the server

### Server Managers
Users with "Manage Guild" permission can:
- Edit or delete any tag in the server
- Use admin commands for bulk operations

## Tag Manager Commands

If you want to give tag management permissions to users **without** the "Manage
Guild" permission, you can grant permissions and use the `/tag-admin` commands.

This can be done by adding Role or Member overrides in the server settings:

```
Server Settings > Integrations > sushiiDev > /tag-admin permissions
```

### Delete Any Tag

```
/tag-admin delete name:tagname
```

### Bulk Delete User Tags

Remove all tags created by a specific user, useful for moderation or cleanup tasks:

```
/tag-admin delete_user_tags user:@username
```
