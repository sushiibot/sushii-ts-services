# User Info Context Menu

Right click a user with "User Info" app.

If it is a regular user running the command, it just shows the userinfo same as
using the userinfo command.

If the user running the command has moderator permissions, additional data and buttons
will be added:

Data:
* Another embed with short history summary
* short lookup data

Buttons:

* Ban
* Kick
* Mute
* Warn
* History
* Lookup

Each button has a custom id:

`lookup:button:action:userId`

For example

`lookup:button:ban:123456789`

This runs the button handler which will edit the message with the following:

If ban, kick, mute, warn:

* Select menu with available reasons
* Button to continue without a reason

If history, lookup just edit message with requested data without any additional
message components.


1. Context menu handler
2. Button handler
3. If ban, kick, mute, warn:
   Select menu handler
