class Team {
    constructor(number, name, affiliation, cityState, country, coach1, coach2, judgingGroup, pitNumber, pitLocation, translationNeeded) {
        this.number = number;
        this.name = name;
        this.affiliation = affiliation;
        this.cityState = cityState;
        this.country = country;
        this.coach1 = coach1;
        this.coach2 = coach2;
        this.judgingGroup = judgingGroup;
        this.pitNumber = pitNumber;
        this.pitLocation = pitLocation;
        this.translationNeeded = translationNeeded;
    }
}

module.exports = Team;