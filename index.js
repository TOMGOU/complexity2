const express = require('express')

const app = express()

const eslint = require('eslint');

const { CLIEngine } = eslint;

class Complexity {
  constructor(max) {
    this.cli = new CLIEngine({
      parserOptions: {
        ecmaVersion: 2018,
      },
      rules: {
        complexity: [
          'error',
          { max }
        ]
      }
    })
    this.reportsList = []
  }

  calculate() {
    return new Promise((resolve, reject) => {
      const reports = this.cli.executeOnFiles(['.']).results;
      const list = []
      reports.forEach((item) => {
        const { messages, filePath } = item
        messages.forEach((messagesItem) => {
          const {
            ruleId,
            line,
            column,
            message,
            nodeType
          } = messagesItem
          const matchMethods = message.match(/'(.+)'/)
          const method = matchMethods ? matchMethods[1] : '无'
          const complexityMatches = message.match(/.+of\s(\d+)\./)
          const complexityCount = complexityMatches ? +complexityMatches[1] : 0
          const record = {
            ruleId,
            method,
            complexity: complexityCount,
            line,
            column,
            message,
            nodeType
          }
          if (['complexity'].includes(ruleId)) {
            list.push({ file: filePath, messages: record })
          }
        })
      })
      this.reportsList = list.sort((a, b) => b.messages.complexity - a.messages.complexity)
      resolve(this.reportsList)
    })
  }

  showReports(port) {
    app.get('/', (req, res) => {
      res.send(this.reportsList)
    })
     
    app.listen(port, () => {
      console.log(`server is running at port ${port}`)
    })
  }
}

module.exports = Complexity;
