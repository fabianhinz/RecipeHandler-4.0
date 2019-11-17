import algoliasearch from 'algoliasearch'

const client = algoliasearch('9B1O8X42PR', '2eecb3efc155f93bc9a597478a3da739')
export const index = client.initIndex('recipes')
