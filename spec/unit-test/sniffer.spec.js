const { sniffer } = require ('../..')

describe ('sniffer', () => {

  it ('should detect correct png mime-type for .jpg extension', () => {
    const expected = 'image/png; charset=binary';
    const actual   = new Promise ((resolve, reject) => {
      sniffer (reject) (resolve) ('spec/fixtures/fake.jpg')
    })

    actual.catch (console.error)

    return expectAsync (actual).toBeResolvedTo (expected)
  })

  it ('should **only** trigger error-handler when given wrong path', () => {
    const wrongPath = '/nothing.gif';
    const actual    = new Promise ((resolve, reject) => {
      sniffer (reject) (resolve) (wrongPath)
    })

    return expectAsync (actual).toBeRejected ()
  })

})

