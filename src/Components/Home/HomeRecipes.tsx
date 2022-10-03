import { Grid, LinearProgress } from '@material-ui/core'

import NotFound from '@/Components/Shared/NotFound'
import Skeletons from '@/Components/Shared/Skeletons'

import HomeRecipeCard from './HomeRecipeCard'

interface Props {
    pagedRecipes: any
    IntersectionObserverTrigger: any
    pagedRecipesSize: any
    querying: boolean
}

export const HomeRecipes = (props: Props) => {
    return (
        <Grid container spacing={3}>
            {[...props.pagedRecipes.values()].map(recipe => (
                <HomeRecipeCard key={recipe.name} recipe={recipe} />
            ))}

            <Skeletons
                variant="recipe"
                visible={props.querying && props.pagedRecipes.size === 0}
                numberOfSkeletons={
                    props.pagedRecipesSize.current > 0 ? props.pagedRecipesSize.current : undefined
                }
            />

            <NotFound visible={!props.querying && props.pagedRecipes.size === 0} />

            <Grid item xs={12} style={{ minHeight: 29 }}>
                {props.querying && <LinearProgress variant="query" color="secondary" />}
                <props.IntersectionObserverTrigger />
            </Grid>
        </Grid>
    )
}
