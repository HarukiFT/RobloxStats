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
        const newUserRecord = this.#newUsers.filter(record => {
            return (record.Breakdown == breakdown && record.Date == date)
        })[0]['Unique Users with Plays']

        const returnUserRecord = this.#returningUsers.filter(record => {
            return (record.Breakdown == breakdown && record.Date == date)
        })[0]['Unique Users with Plays']

        return newUserRecord + returnUserRecord
    }

    calculateKoeff(date) {
        const visits = this.calculateByBreakdown(date, 'Total')
        const sessionRecord = this.#sessions.filter(record => {
            return (record.Date == date && record.Breakdown == 'Total')
        })[0].Sessions

        return sessionRecord / visits
    }

    proceed() {
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
            return [...accumulator, current.Date]
        }, [])

        for (let singleRecord of newUserRecords) {
            const koeff = this.calculateKoeff(singleRecord.Date)
            console.log(koeff)

            for (let breakdown of breakdowns) {
                if (!breakdownsData[breakdown]) { breakdownsData[breakdown] = [] }
                breakdownsData[breakdown].push(this.calculateByBreakdown(singleRecord.Date, breakdown) * koeff)
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
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default DataSet