import {
    AvTimer,
    Barley,
    Beer,
    Bowl,
    BreadSliceOutline,
    CakeVariant,
    Cookie,
    Cow,
    Cupcake,
    EggEaster,
    Fish,
    GlassCocktail,
    KettleOutline,
    Leaf,
    Pasta,
    Pizza,
    WeatherPartlyCloudy,
    WeatherPouring,
    WeatherSnowy,
    WeatherSunny,
} from 'mdi-material-ui'
import React from 'react'

const getIconByCategory = (category: string) => {
    switch (category) {
        case 'Beilage':
            return <Pizza />
        case 'Brot':
            return <BreadSliceOutline />
        case 'Dessert':
            return <Cupcake />
        case 'Getränke':
            return <Beer />
        case 'Hauptgericht':
            return <Pasta />
        case 'Kuchen':
            return <CakeVariant />
        case 'Plätzchen':
            return <Cookie />
        case 'Salat':
            return <Leaf />
        case 'Suppe':
            return <Bowl />
        case 'Alkohol':
            return <GlassCocktail />
        case 'Alkoholfrei':
            return <KettleOutline />
        case 'Fisch':
            return <Fish />
        case 'Fleisch':
            return <Cow />
        case 'Vegan':
            return <Barley />
        case 'Vegetarisch':
            return <EggEaster />
        case 'Frühling':
            return <WeatherPartlyCloudy />
        case 'Sommer':
            return <WeatherSunny />
        case 'Herbst':
            return <WeatherPouring />
        case 'Winter':
            return <WeatherSnowy />
        default:
            return <AvTimer />
    }
}

export default getIconByCategory
