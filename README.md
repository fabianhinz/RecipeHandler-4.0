[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=fabianhinz/RecipeHandler-4.0&identifier=207148306)](https://dependabot.com)

# RecipeHandler-4.0

## about this project

A Progressive Web App to collect, categorise and share recipes. The project serves as playground for upcoming, exciting web standards. So don't expect it to work in IE11 :scream:. This can easily be deployed to a new Firebase project. If you need help with that feel free to contact me. The extensive usage of firestore security rules combined with custom claims (JWT) enables user administration

![](./appPreview.svg)
___

# ReadMe

## Getting started

1. clone this repo
1. install [nodejs](https://nodejs.org/en/)
1. install [vs code](https://code.visualstudio.com/) and the following plugins: [(1)](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [(2)](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [(3)](https://marketplace.visualstudio.com/items?itemName=vscodeshift.material-ui-snippets)
1. navigate into the root dir of the cloned repo and `npm install` via your prefered shell
1. to start the webapp run `npm start`

## Testplan

> wip 

- https://docs.google.com/spreadsheets/d/1heY9iIOZixZRMYhq6JMEn8OaiBvwpGnqNuQkd0LpFt8/edit?usp=sharing

## firebase emulators

- run `firebase:emulators:start`. This will start the emulators und sync data from `./emulators-data`
- if stopping and restarting does not work because of blocked ports consider killing it `lsof -i tcp:<PORT>`, `kill -9 <PID>`
- for every role in this app (user, editor, admin) there's a user. PW and identifier (email) are the same
- working on functions: for every change needs a `tsc`
- working on the app: algolia is disabled

## Deploy a preview version

Firebase offers the possibility to deploy preview versions on separate preview channels. An example for a channel ID is ```my_new_test_feature```. For more information read the [firebase docs](https://firebase.google.com/docs/hosting/test-preview-deploy#preview-channels).

1. to build the project run `npm run build`
1. to start the preview hosting run ```firebase hosting:channel:deploy YOUR_CHANNEL_ID```
1. access your project on the generated preview URI

### from the local machine

export VERSION=$(git rev-parse --short HEAD) && npm run build && firebase deploy --only hosting --message $VERSION