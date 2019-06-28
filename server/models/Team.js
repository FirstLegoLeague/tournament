class Team {
  constructor (number, name) {
    this.number = number
    this.name = name
    this.affiliation = undefined
    this.cityState = undefined
    this.country = undefined
    this.coach1 = undefined
    this.coach2 = undefined
    this.judgingGroup = undefined
    this.pitNumber = undefined
    this.pitLocation = undefined
    this.translationNeeded = undefined
  }
}

Team.IdField = '_id'
exports.Team = Team
