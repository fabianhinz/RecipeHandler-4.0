class ElementIdService {
  private index: number

  constructor() {
    this.index = 0
  }

  public getId(prefix?: string) {
    return `${prefix || 'id-by-element-id-service'}-${++this.index}`
  }
}

export default new ElementIdService()
