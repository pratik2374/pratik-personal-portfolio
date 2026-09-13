import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  console.log('Project ID:', client.config().projectId)
}
run()
