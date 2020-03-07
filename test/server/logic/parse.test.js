const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { parse, ParsingException } = require('../../../server/logic/parse')

chai.use(sinonChai)
const { expect } = chai

function createLogger () {
  return {
    debug: sinon.spy(() => { }),
    info: sinon.spy(() => { }),
    warn: sinon.spy(() => { }),
    error: sinon.spy(() => { }),
    fatal: sinon.spy(() => { })
  }
}

const EMPTY_STRING = ''
const TEAMS_STRING = `name, number, affiliation
1,The first team,Westworld
2,Two is always together,Ba-Sing-Se
8,Magic 8,Naboo
15,The RoboJars,Gravity Falls
54,What will you get if you multiply six by nine?,Narnia
123,Genesis,Rivendell
132,King of Hearts,Hogwarts
173,The Society of the Blind Eye,Gotham
182,The blue dot,Winterfell
534,The Fellowship of the Ring,Camelot
856,The Order of the Phoenix,Wanderland
956,ElectroWreckers,Oz
981,The Green slime club,Neverland
2212,The Spikes,Lod
2468,Even us,Avalon
8846,Syntax error,Matrix`

const DUPLICATE_TEAM_TEAMS_STRING = `name, number, affiliation
1,The first team,Westworld
2,Two is always together,Ba-Sing-Se
8,Magic 8,Naboo
15,The RoboJars,Gravity Falls
54,What will you get if you multiply six by nine?,Narnia
123,Genesis,Rivendell
132,King of Hearts,Hogwarts
173,The Society of the Blind Eye,Gotham
182,The blue dot,Winterfell
534,The Fellowship of the Ring,Camelot
856,The Order of the Phoenix,Wanderland
956,ElectroWreckers,Oz
981,The Green slime club,Neverland
2212,The Spikes,Lod
2468,Even us,Avalon
8846,Syntax error,Matrix
8846,Syntax error,Matrix`

const SCHEDULE_STRING = `Version Number,1
Block Format,1
Number of Teams,16
1,The first team,Westworld
2,Two is always together,Ba-Sing-Se
8,Magic 8,Naboo
15,The RoboJars,Gravity Falls
54,What will you get if you multiply six by nine?,Narnia
123,Genesis,Rivendell
132,King of Hearts,Hogwarts
173,The Society of the Blind Eye,Gotham
182,The blue dot,Winterfell
534,The Fellowship of the Ring,Camelot
856,The Order of the Phoenix,Wanderland
956,ElectroWreckers,Oz
981,The Green slime club,Neverland
2212,The Spikes,Lod
2468,Even us,Avalon
8846,Syntax error,Matrix
Block Format,2
Number of Ranking Matches,24
Number of Tables,4
Number of Teams Per Table,2
Number of Simultaneous Tables,2
Table Names,Table1,Table2,Table3,Table3
13,11:15,11:18,1,8,,
14,11:20,11:23,,,2,15
15,11:25,11:28,182,173,,
16,11:30,11:33,,,132,123
17,11:35,11:38,54,534,,
18,11:40,11:43,,,856,956
19,11:45,11:48,981,2212,,
20,11:50,11:53,,,2468,8846
25,13:05,13:08,,1,8,,
26,13:10,13:13,,,2,15
27,13:15,13:18,182,173,,
28,13:20,13:23,,,132,123
29,13:25,13:28,54,534,,
30,13:30,13:33,,,856,956
31,13:35,13:38,981,2212,,
32,13:40,13:43,,,2468,8846
37,14:20,14:23,,1,8,,
38,14:25,14:28,,,2,15
39,14:30,14:33,182,173,,
40,14:35,14:38,,,132,123
41,14:40,14:43,54,534,,
42,14:45,14:48,,,856,956
43,14:50,14:53,981,2212,,
44,14:55,14:58,,,2468,8846
Block Format,3
Number of Judged Events,1
Number of Event Time Slots,8
Number of Judging Teams,3
Event Name,חדר שיפוט
Room Names,1,2,3
1,09:15,09:40,2432,2436,1912,
2,09:55,10:20,1897,2418,1108,
3,10:35,11:00,1621,911,1412,
4,11:15,11:40,966,2386,705,
5,12:10,12:35,1723,2382,165,
6,12:50,13:15,1629,2414,957,
7,13:30,13:55,2431,2035,2036,
8,14:10,14:35,1611,1913,9999,
Block Format,4
Number of Practice Matches,8
Number of Tables,4
Number of Teams Per Table,2
Number of Simultaneous Tables,2
Table Names,Table1,Table2,Table3,Table3
1,09:15,09:18,1,8,,
2,09:21,09:24,,,2,15
3,09:27,09:30,182,173,,
4,09:33,09:36,,,132,123
5,09:39,09:42,54,534,,
6,09:45,09:48,,,856,956
7,09:51,09:54,981,2212,,
8,09:57,10:00,,,2468,8846
`

const DUPLICATE_TEAM_SCHEDULE_STRING = `Version Number,1
Block Format,1
Number of Teams,16
1,The first team,Westworld
1,Two is always together,Ba-Sing-Se
8,Magic 8,Naboo
15,The RoboJars,Gravity Falls
54,What will you get if you multiply six by nine?,Narnia
123,Genesis,Rivendell
132,King of Hearts,Hogwarts
173,The Society of the Blind Eye,Gotham
182,The blue dot,Winterfell
534,The Fellowship of the Ring,Camelot
856,The Order of the Phoenix,Wanderland
956,ElectroWreckers,Oz
981,The Green slime club,Neverland
2212,The Spikes,Lod
2468,Even us,Avalon
8846,Syntax error,Matrix
Block Format,2
Number of Ranking Matches,24
Number of Tables,4
Number of Teams Per Table,2
Number of Simultaneous Tables,2
Table Names,Table1,Table2,Table3,Table3
13,11:15,11:18,1,8,,
14,11:20,11:23,,,2,15
15,11:25,11:28,182,173,,
16,11:30,11:33,,,132,123
17,11:35,11:38,54,534,,
18,11:40,11:43,,,856,956
19,11:45,11:48,981,2212,,
20,11:50,11:53,,,2468,8846
25,13:05,13:08,,1,8,,
26,13:10,13:13,,,2,15
27,13:15,13:18,182,173,,
28,13:20,13:23,,,132,123
29,13:25,13:28,54,534,,
30,13:30,13:33,,,856,956
31,13:35,13:38,981,2212,,
32,13:40,13:43,,,2468,8846
37,14:20,14:23,,1,8,,
38,14:25,14:28,,,2,15
39,14:30,14:33,182,173,,
40,14:35,14:38,,,132,123
41,14:40,14:43,54,534,,
42,14:45,14:48,,,856,956
43,14:50,14:53,981,2212,,
44,14:55,14:58,,,2468,8846
Block Format,3
Number of Judged Events,1
Number of Event Time Slots,8
Number of Judging Teams,3
Event Name,חדר שיפוט
Room Names,1,2,3
1,09:15,09:40,2432,2436,1912,
2,09:55,10:20,1897,2418,1108,
3,10:35,11:00,1621,911,1412,
4,11:15,11:40,966,2386,705,
5,12:10,12:35,1723,2382,165,
6,12:50,13:15,1629,2414,957,
7,13:30,13:55,2431,2035,2036,
8,14:10,14:35,1611,1913,9999,
Block Format,4
Number of Practice Matches,8
Number of Tables,4
Number of Teams Per Table,2
Number of Simultaneous Tables,2
Table Names,Table1,Table2,Table3,Table3
1,09:15,09:18,1,8,,
2,09:21,09:24,,,2,15
3,09:27,09:30,182,173,,
4,09:33,09:36,,,132,123
5,09:39,09:42,54,534,,
6,09:45,09:48,,,856,956
7,09:51,09:54,981,2212,,
8,09:57,10:00,,,2468,8846
`

describe('Parser', () => {
  let logger

  beforeEach(() => {
    logger = createLogger()
  })

  it('throws a ParsingException if the rawData is empty', () => {
    expect(() => parse(EMPTY_STRING, logger)).to.throw(ParsingException)
  })

  it('parses teams from a teams format', () => {
    const schedule = parse(TEAMS_STRING, logger)
    TEAMS_STRING.split('\n').splice(1).forEach((line, index) => {
      const team = schedule.teams[index]
      const values = line.split(',')
      expect(team.number).to.equal(parseInt(values[0]))
      expect(team.name).to.equal(values[1])
      expect(team.affiliation).to.equal(values[2])
    })
  })

  it('throws error when team is duplicate while parsing teams file', () => {
    expect(() => parse(DUPLICATE_TEAM_TEAMS_STRING, logger)).to.throw(ParsingException)
  })

  it('parses schedule from a schedule format', () => {
    const schedule = parse(SCHEDULE_STRING, logger)
    expect(schedule.teams.length).to.equal(16)
    expect(schedule.tables.length).to.equal(4)
    expect(schedule.matches.length).to.equal(32)
    schedule.teams.forEach(team => expect(team.constructor.name).to.equal('Team'))
    schedule.tables.forEach(table => expect(table.constructor.name).to.equal('Table'))
    schedule.matches.forEach(match => expect(match.constructor.name).to.equal('Match'))
  })

  it('throws error when team is duplicate while parsing teams schedule', () => {
    expect(() => parse(DUPLICATE_TEAM_SCHEDULE_STRING, logger)).to.throw(ParsingException)
  })
})
