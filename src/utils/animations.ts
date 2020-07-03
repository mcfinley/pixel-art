const getMoment = () => new Date().getTime()

export class AnimatedValue {
  private lastMoment: number
  private lastValue: number

  constructor (private value: number, private duration: number) {
    this.lastMoment = getMoment()
    this.lastValue = value
  }

  set = (value: number) => {
    this.lastValue = this.get()
    this.value = value
    this.lastMoment = getMoment()
    // this
  }

  get = () => {
    const nowMoment = getMoment()
    const timediff = nowMoment - this.lastMoment

    if (timediff > this.duration) {
      this.lastValue = this.value
      this.lastMoment = getMoment()
      return this.value
    }

    const valuediff = this.value - this.lastValue
    const valueOnTop = valuediff * Math.min(1, timediff / this.duration)

    return valueOnTop + this.lastValue
  }
}