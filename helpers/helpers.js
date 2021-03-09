export const nonPlayableRoles = [5, 6, 7];

/*
    * FieldPosition =>
    0: "No position", 
    1: "Goal keeper", 
    2: "Defender", 
    3: "Midfielder", 
    4: "Forward", 
    5: "Non-playing admin", 
    6: "Coach", 
    7: "Physiotherapist", 
    10: "Defender F5",
    11: "Target F5",
    12: "Winger F5",
*/

export const matchHasSootOut = match => {
  if (match.visibleHomeScore !== 0 || match.visibleVisitorScore !== 0) return true;
  return false;
};

export const playerNotAcceptedNotices = (playerMatchNotices, startTime) =>
  playerMatchNotices.filter(playerMatchNotice => {
    const { accepted, notice } = playerMatchNotice;
    const { hoursInAdvance, enabled } = notice;

    if (!enabled) return false;

    const matchTime = moment(startTime);
    const now = moment();
    const matchMaxDuration = 2; // 🔎 match max estimate duration in hours. 💥 NOT a nice solution

    const matchTimeHoursFromNow = matchTime.diff(now, 'hours');

    // 🔎 Setting 24 hours as default.
    const hours = hoursInAdvance === -1 ? 24 : hoursInAdvance;

    const timeIsInRange = matchTimeHoursFromNow > matchMaxDuration * -1 && matchTimeHoursFromNow < hours;

    if (timeIsInRange && !accepted) return true;
    return false;
  });
