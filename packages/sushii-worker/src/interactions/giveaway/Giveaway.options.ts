export enum GiveawayOption {
  GiveawayID = "giveaway_id",

  // Required options
  Duration = "duration",
  Winners = "winners",
  Prize = "prize",

  // Optional
  RequiredRole = "required_role",
  RequiredMinLevel = "min_level",
  RequiredMaxLevel = "max_level",
  RequiredNitroState = "required_nitro",
  BoosterStatus = "booster_status",

  // Roll options
  AllowRepeatWinners = "allow_repeat_winners",
}
