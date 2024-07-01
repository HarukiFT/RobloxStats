import { unparse } from "papaparse"

class DataSet {
    #newUsers
    #returningUsers
    #sessions

    constructor (newUsers, returningUsers, sessions) {
        this.#newUsers = newUsers
        this.#returningUsers = returningUsers
        this.#sessions = sessions
    }

    calculateByBreakdown(date, breakdown) {
        const newUserRecord = parseInt(this.#newUsers.filter(record => {
            return (record.Breakdown == breakdown && record.Date == date)
        })[0]['Unique Users with Plays'])

        const returnUserRecord = parseInt(this.#returningUsers.filter(record => {
            return (record.Breakdown == breakdown && record.Date == date)
        })[0]['Unique Users with Plays'])

        return newUserRecord + returnUserRecord
    }

    calculateKoeff(date) {
        const visits = this.calculateByBreakdown(date, 'Total')
        const sessionRecord = parseInt(this.#sessions.filter(record => {
            return (record.Date == date && record.Breakdown == 'Total')
        })[0].Sessions)

        return sessionRecord / visits
    }

    validateTimeframe() {
        const newUsersDates = this.#newUsers.reduce((count, record) => { return record.Breakdown == 'Total' ? count + 1 : count }, 0)
        const returningUsersDates = this.#returningUsers.reduce((count, record) => { return record.Breakdown == 'Total' ? count + 1 : count }, 0)
        const sessionsDates = this.#sessions.reduce((count, record) => { return record.Breakdown == 'Total' ? count + 1 : count }, 0)

        return (newUsersDates != returningUsersDates || newUsersDates != sessionsDates || returningUsersDates != sessionsDates)
    }

    proceed() {
        if (this.validateTimeframe()) {
            return false
        }

        const newUserRecords = this.#newUsers.filter(record => {
            return (record.Breakdown == 'Total')
        }).sort((a, b) => {
            return new Date(a.Date) - new Date(b.Date)
        })

        const breakdowns = new Set()
        this.#newUsers.forEach(record => {
            breakdowns.add(record.Breakdown)
        });

        const breakdownsData = {}
        const dates = newUserRecords.reduce((accumulator, current) => {
            const dateObject = new Date(current.Date)
            return [...accumulator, `${(dateObject.getMonth() + 1).toString().padStart(2, '0')}.${dateObject.getDate().toString().padStart(2, '0')}`]
        }, [])

        for (let singleRecord of newUserRecords) {
            const koeff = this.calculateKoeff(singleRecord.Date)

            for (let breakdown of breakdowns) {
                if (!breakdownsData[breakdown]) { breakdownsData[breakdown] = [] }
                breakdownsData[breakdown].push(Math.round(this.calculateByBreakdown(singleRecord.Date, breakdown) * koeff))
            }
        }

        const breakdownFormatted = []
        Object.entries(breakdownsData).forEach(([breakdown, data]) => {
            const dateMap = {}
            data.forEach((value, index) => {
                dateMap[dates[index]] = value
            })

            breakdownFormatted.push({breakdown, ...dateMap})
        })

        const csv = unparse(breakdownFormatted, {
            columns: ['breakdown', ...dates],
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        return blob
    }
}

export default DataSet