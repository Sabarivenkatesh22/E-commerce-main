class TestController {

  async test(req, res){
    res.status(200).send("Running")
  }

}

const testController = new TestController()
module.exports = testController
