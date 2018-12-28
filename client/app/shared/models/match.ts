import {Editable, Deletable} from './interfaces/modal-model'
import {Deserializable} from './interfaces/deserializable'

export type MatchTeam = { teamNumber: number, tableId: number }

export class Match implements Editable, Deletable, Deserializable {

    _id: string;
    matchId: number;
    stage: string;
    startTime: string;
    endTime: string;
    matchTeams: MatchTeam[];

    id() {
        return this._id;
    }

    title() {
        return this.id() ? `Match ${this.stage} #${this.matchId}` : 'New Match';
    }

    timeInputValueFromField(timeFieldValue) {
        return new Date(timeFieldValue).toLocaleTimeString('en-GB').replace(/:\d+$/, '');
    }

    setTimeFieldFromInput(timeFieldName, timeInputValue) {
        const [hours, minutes] = timeInputValue.split(':');
        const date = this[timeFieldName] ? new Date(this[timeFieldName]) : new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setFullYear(1970, 0, 1)
        this[timeFieldName] = date.toISOString()
    }

    fields() {
        const teamFields = [];
        for (let i = 0; i < this.matchTeams.length; ++i) {
            teamFields.push({
                display: `Team ${i + 1}`,
                type: 'text',
                get: () => this.matchTeams[i].teamNumber,
                set: (value) => {
                    this.matchTeams[i].teamNumber = value
                },
                editable: true
            });
        }

        const stageOptions = [
            {
                display: 'Practice',
                value: 'practice'
            },
            {
                display: 'Ranking',
                value: 'ranking'
            }
        ]

        return [
            {
                display: 'Stage',
                type: 'select',
                get: () => {
                    if(!this.stage){
                        this.stage = stageOptions[0].value
                    }
                    return this.stage;
                },
                set: (value) => {
                    this.stage = value
                },
                editable: true,
                options: stageOptions
            },
            {
                display: 'Start time',
                type: 'time',
                get: () => this.timeInputValueFromField(this.startTime),
                set: (value) => this.setTimeFieldFromInput('startTime', value),
                editable: true
            },
            {
                display: 'End time',
                type: 'time',
                get: () => this.timeInputValueFromField(this.endTime),
                set: (value) => this.setTimeFieldFromInput('endTime', value),
                editable: true
            }
        ].concat(teamFields);
    }

    body() {
        return {
            stage: this.stage,
            startTime: this.startTime,
            endTime: this.endTime,
            matchTeams: this.matchTeams
        };
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

    savedInDB() {
        return !!this._id;
    }

}
