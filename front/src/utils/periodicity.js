/*
 * list: Array(Incomes) | Array(Expenses)
 * from (optional): Date()
 * to (optional): Date()
*/
export function unfold(list, from, to) {
  if (!to) {
    to = new Date()
  }

  let dateStart = 'receivedOn'
  let dateEnd = 'canceledOn'
  if (list.length && list[0].dueDate) {
    dateStart = 'dueDate'
    dateEnd = 'endDate'
  }

  const newList = []
  list.map(obj => {
    let objFrom = new Date(obj[dateStart])
    if (from && from > objFrom)
      objFrom = from
    let objTo = to
    if (obj[dateEnd] && to > new Date(obj[dateEnd]))
      objTo = new Date(obj[dateEnd])

    if (objFrom > objTo) return

    const day = objFrom.getDate()
    let resetDay = false
    switch (obj.periodicity) {
      case 'NONE':
        if (new Date(obj[dateStart]) >= objFrom)
          newList.push({...obj})
        break
      case 'DAILY':
        while (objFrom <= objTo) {
          let newObj = {...obj}
          newObj[dateStart] = objFrom.toJSON()
          newList.push(newObj)
          objFrom.setDate(objFrom.getDate() + 1)
        }
        break
      case 'WEEKLY':
        objFrom = new Date(obj[dateStart])
        while (objFrom <= objTo) {
          if (!from || objFrom >= from) {
            let newObj = {...obj}
            newObj[dateStart] = objFrom.toJSON()
            newList.push(newObj)
          }
          objFrom.setDate(objFrom.getDate() + 7)
        }
        break
      case 'MONTHLY':
        objFrom = new Date(obj[dateStart])
        while (objFrom <= objTo) {
          if (!from || objFrom >= from) {
            let newObj = {...obj}
            newObj[dateStart] = objFrom.toJSON()
            newList.push(newObj)
          }
          let temp = new Date(objFrom)
          temp.setMonth(temp.getMonth() + 1)
          if (objFrom.getDate() !== temp.getDate()) {
            temp.setDate(0)
            objFrom.setDate(temp.getDate())
          } else if (temp.getDate() !== day) {
            let month = temp.getMonth()
            temp.setDate(day)
            if (temp.getMonth() === month) {
              resetDay = true
            }
          }
          objFrom.setMonth(objFrom.getMonth() + 1)
          if (resetDay) {
            objFrom.setDate(day)
            resetDay = false
          }
        }
        break
      case 'ANNUALLY':
        objFrom = new Date(obj[dateStart])
        while (objFrom <= objTo) {
          if (!from || objFrom >= from) {
            let newObj = {...obj}
            newObj[dateStart] = objFrom.toJSON()
            newList.push(newObj)
          }
          let temp = new Date(objFrom)
          temp.setFullYear(temp.getFullYear() + 1)
          if (objFrom.getMonth() !== temp.getMonth()) {
            temp.setDate(0)
            objFrom.setDate(temp.getDate())
          } else if (temp.getDate() !== day) {
            temp.setDate(day)
            if (objFrom.getMonth() === temp.getMonth()) {
              resetDay = true
            }
          }
          objFrom.setFullYear(objFrom.getFullYear() + 1)
          if (resetDay) {
            objFrom.setDate(day)
            resetDay = false
          }
        }
    }
  })

  return newList
}
