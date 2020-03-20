const { Model } = require('@first-lego-league/synced-resources')

class Status extends Model { }

Status.initialValue = {
  nextMatchId: 0,
  nextMatchTime: undefined
}

exports.Status = Status
