# Roles

/rolemenu create title: description: max: channel?:

roleMenuMessageID = GET /rolemenu/:channelID/:userID
if roleMenuMessageID not null:
    return "You are already creating a role menu, use /rolemenu add to add roles to the menu!"

POST /rolemenu/:channelID/:userID

Embed: 
* Title
* Description:
* Use `/rolemenu add` to add another role
* Dropdown: Select roles
* Button: Done, Cancel

(Dropdown to add roles does not work as max 25 options per select menu)

--

Done -> DELETE /rolemenu/:channelID/:userID

---

/rolemenu role add role: label: description: emoji:

roleMenuMessageID = GET /rolemenu/:channelID/:userID

if !roleMenuMessageID:
    say "Create a role menu with /rolemenu create before adding roles!"
    return

edit roleMenuMessageID with new role

/rolemenu role remove:

/rolemenu edit messageId: channel: description: max:
