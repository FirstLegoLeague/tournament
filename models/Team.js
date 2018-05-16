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

    static deserialize(rawTeam) {
        let newTeam = new Team();

        newTeam.number = parseIntOrUndefined(rawTeam[0]);
        newTeam.name = stringOrUndefined(rawTeam[1]);
        newTeam.affiliation = stringOrUndefined(rawTeam[2]);
        newTeam.cityState = stringOrUndefined(rawTeam[3]);
        newTeam.country = stringOrUndefined(rawTeam[4]);
        newTeam.coach1 = stringOrUndefined(rawTeam[5]);
        newTeam.coach2 = stringOrUndefined(rawTeam[6]);
        newTeam.judgingGroup = stringOrUndefined(rawTeam[7]);
        newTeam.pitNumber = parseIntOrUndefined(rawTeam[8]);
        newTeam.pitLocation = stringOrUndefined(rawTeam[9]);
        newTeam.translationNeeded = parseBooleanOrUndifined(rawTeam[10]);

        return newTeam;
    }

}


function parseIntOrUndefined(int){
    if (int == ''){
        return undefined;
    }
    return parseInt(int);
}

function stringOrUndefined(string){
    if(string == ''){
        return undefined;
    }
    return string
}

function parseBooleanOrUndifined(bool){
    if(bool == ''){
        return undefined;
    }

    return bool == 'true';
}

module.exports = Team;