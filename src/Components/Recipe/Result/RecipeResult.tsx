import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import React, { FC, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { RecipeResultImg } from './RecipeResultImg'
import { Grid, Typography, Box, Slide, Button } from '@material-ui/core'
import { Recipe, AttachementData, AttachementMetadata } from '../../../model/model'
import { Subtitle } from '../../Shared/Subtitle'
import { CategoryResult } from '../../Category/CategoryResult'
import { ReactComponent as NotFoundIcon } from '../../../icons/notFound.svg'
import { useRouterContext } from '../../Provider/RouterProvider'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { PATHS } from '../../Routes/Routes'
import { FirebaseService } from '../../../firebase'
import { RecipeResultRelated } from './RecipeResultRelated'
import { RecipeRating } from '../../Recipe/RecipeRating'
import { RecipeComments } from '../../Recipe/Comments/RecipeComments'
import { RecipeShare } from '../../Recipe/RecipeShare'
import { useDraggableRecipesContext } from '../../Provider/DraggableRecipesProvider'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { GridSize } from '@material-ui/core/Grid'

interface RecipeResultProps {
	recipe: Recipe<AttachementMetadata | AttachementData> | null
	preview?: boolean
	fromRelated?: boolean
}

const RecipeResult: FC<RecipeResultProps> = ({ recipe, preview, fromRelated }) => {
	const { history } = useRouterContext()
	const { user } = useFirebaseAuthContext()
	const { handleDraggableChange } = useDraggableRecipesContext()

	if (!recipe)
		return (
			<Box display="flex" justifyContent="center">
				<Slide in direction="down" timeout={500}>
					<NotFoundIcon width={200} />
				</Slide>
			</Box>
		)

	const breakpoints = (options: {
		ingredient: boolean
	}): Partial<Record<Breakpoint, boolean | GridSize>> =>
		fromRelated ? { xs: 12 } : { xs: 12, md: 6, lg: options.ingredient ? 4 : 6 }

	return (
		<Grid container spacing={2}>
			<Grid item>
				<Grid container justify="space-between" alignItems="center">
					<Grid item>
						<Typography variant="h6">{recipe.name}</Typography>
					</Grid>
					{!preview && (
						<Grid item>
							<Grid container>
								<Grid item>
									<RecipeShare name={recipe.name} />
								</Grid>
								<Grid>
									<RecipeComments
										numberOfComments={recipe.numberOfComments}
										name={recipe.name}
									/>
								</Grid>
								<Grid>
									<RecipeRating name={recipe.name} />
								</Grid>
							</Grid>
						</Grid>
					)}
				</Grid>
			</Grid>
			<Grid item>
				<CategoryResult categories={recipe.categories} />
			</Grid>

			<Grid item xs={12}>
				<Grid container spacing={2}>
					{recipe.attachements.map(attachement => (
						<RecipeResultImg
							fromRelated={fromRelated}
							key={attachement.name}
							attachement={attachement}
						/>
					))}
				</Grid>
			</Grid>

			<Grid item xs={12} />

			<Grid {...breakpoints({ ingredient: true })} item>
				<Subtitle icon={<AssignmentIcon />} text={`Zutaten für ${recipe.amount}`} />
				<ReactMarkdown source={recipe.ingredients} />
			</Grid>

			<Grid {...breakpoints({ ingredient: false })} item>
				<Subtitle icon={<BookIcon />} text="Beschreibung" />
				<ReactMarkdown source={recipe.description} />
			</Grid>

			<Grid item xs={12}>
				<Subtitle icon={<LabelIcon />} text="Passt gut zu" />
				<RecipeResultRelated relatedRecipes={recipe.relatedRecipes} />
			</Grid>

			<Grid item xs={12}>
				<Typography variant="caption">
					Erstellt am:{' '}
					{FirebaseService.createDateFromTimestamp(
						recipe.createdDate,
					).toLocaleDateString()}
				</Typography>
			</Grid>

			<Grid item xs={12}>
				<Grid container justify="flex-end" spacing={2}>
					<Grid item>
						{!fromRelated && (
							<Button
								color="primary"
								variant="contained"
								onClick={() => handleDraggableChange(recipe.name)}
							>
								Anpinnen
							</Button>
						)}
					</Grid>
					<Grid item>
						{user && !preview && (
							<Button
								color="primary"
								variant="contained"
								onClick={() =>
									history.push(PATHS.recipeEdit(recipe.name), { recipe })
								}
							>
								Bearbeiten
							</Button>
						)}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default memo(
	RecipeResult,
	(prev, next) => prev.recipe === next.recipe && prev.preview === next.preview,
)
