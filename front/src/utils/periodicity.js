export function unfold(list, a, b) {
  if (!b) {
    b = new Date()
  }

  const newList = []
  list.map(obj => {
    let objA = new Date(obj.receivedOn)
    if (a && a > objA)
      objA = a
    let objB = b
    if (obj.canceledOn && b > new Date(obj.canceledOn))
      objB = new Date(obj.canceledOn)

    if (objA > objB) return

    const day = objA.getDate()
    let resetDay = false
    switch (obj.periodicity) {
      case 'NONE':
        newList.push({...obj})
        break
      case 'DAILY':
        while (objA <= objB) {
          let newObj = {...obj}
          newObj.receivedOn = objA.toJSON()
          newList.push(newObj)
          objA.setDate(objA.getDate() + 1)
        }
        break
      case 'WEEKLY':
        objA = new Date(obj.receivedOn)
        while (objA <= objB) {
          if (!a || objA >= a) {
            let newObj = {...obj}
            newObj.receivedOn = objA.toJSON()
            newList.push(newObj)
          }
          objA.setDate(objA.getDate() + 7)
        }
        break
      case 'MONTHLY':
        objA = new Date(obj.receivedOn)
        while (objA <= objB) {
          if (!a || objA >= a) {
            let newObj = {...obj}
            newObj.receivedOn = objA.toJSON()
            newList.push(newObj)
          }
          let temp = new Date(objA)
          temp.setMonth(temp.getMonth() + 1)
          if (objA.getDate() !== temp.getDate()) {
            temp.setDate(0)
            objA.setDate(temp.getDate())
          } else if (temp.getDate() !== day) {
            let month = temp.getMonth()
            temp.setDate(day)
            if (temp.getMonth() === month) {
              resetDay = true
            }
          }
          objA.setMonth(objA.getMonth() + 1)
          if (resetDay) {
            objA.setDate(day)
            resetDay = false
          }
        }
        break
      case 'ANNUALLY':
        objA = new Date(obj.receivedOn)
        while (objA <= objB) {
          if (!a || objA >= a) {
            let newObj = {...obj}
            newObj.receivedOn = objA.toJSON()
            newList.push(newObj)
          }
          let temp = new Date(objA)
          temp.setFullYear(temp.getFullYear() + 1)
          if (objA.getMonth() !== temp.getMonth()) {
            temp.setDate(0)
            objA.setDate(temp.getDate())
          } else if (temp.getDate() !== day) {
            temp.setDate(day)
            if (objA.getMonth() === temp.getMonth()) {
              resetDay = true
            }
          }
          objA.setFullYear(objA.getFullYear() + 1)
          if (resetDay) {
            objA.setDate(day)
            resetDay = false
          }
        }
    }
  })

  return newList
}
