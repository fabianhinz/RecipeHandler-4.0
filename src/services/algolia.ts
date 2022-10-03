import { createInMemoryCache } from '@algolia/cache-in-memory'
import algoliasearch from 'algoliasearch'

const client = algoliasearch('9B1O8X42PR', '2eecb3efc155f93bc9a597478a3da739', {
  responsesCache: createInMemoryCache(),
  requestsCache: createInMemoryCache({ serializable: false }),
})

export default client.initIndex('recipes')
