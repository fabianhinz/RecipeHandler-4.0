import EditIcon from '@material-ui/icons/Edit'
import { SpeedDialAction } from '@material-ui/lab'
import { CloudUploadOutline } from 'mdi-material-ui'
import { FC } from 'react'
import { useHistory } from 'react-router-dom'

import AttachmentUpload from '@/Components/Attachments/AttachmentUpload'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { PATHS } from '@/Components/Routes/Routes'
import Progress from '@/Components/Shared/Progress'
import SpeedDialWrapper from '@/Components/Shared/SpeedDialWrapper'
import { useAttachmentDropzone } from '@/hooks/useAttachmentDropzone'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { useRecipeDoc } from '@/hooks/useRecipeDoc'
import { RouteWithRecipeName } from '@/model/model'

import RecipeResult from '../Result/RecipeResult'

const RecipeDetails: FC<RouteWithRecipeName> = routeProps => {
  const { recipeDoc, recipeDocLoading } = useRecipeDoc({
    recipeName: routeProps.match.params.name,
  })

  const { user } = useFirebaseAuthContext()
  const history = useHistory()

  const { dropzoneAttachments, dropzoneProps, dropzoneAlert } = useAttachmentDropzone({
    attachmentMaxWidth: 3840,
    attachmentLimit: 5,
  })

  useDocumentTitle(recipeDoc ? recipeDoc.name : recipeDocLoading ? 'Wird geladen...' : '404')

  return (
    <>
      {recipeDocLoading ? <Progress variant="fixed" /> : <RecipeResult recipe={recipeDoc} />}

      {recipeDoc && user && (
        <>
          <SpeedDialWrapper>
            <SpeedDialAction
              icon={<EditIcon />}
              tooltipTitle="Rezept bearbeiten"
              onClick={() =>
                history.push(PATHS.recipeEdit(recipeDoc.name), {
                  recipe: recipeDoc,
                })
              }
              FabProps={{ size: 'medium' }}
            />
            <SpeedDialAction
              icon={<CloudUploadOutline />}
              tooltipTitle="Bilder hochladen"
              FabProps={{ size: 'medium' }}
              {...dropzoneProps.getRootProps()}
            />
          </SpeedDialWrapper>

          <AttachmentUpload
            recipeName={recipeDoc.name}
            dropzoneAttachments={dropzoneAttachments}
            dropzoneAlert={dropzoneAlert}
          />

          <input {...dropzoneProps.getInputProps()} />
        </>
      )}
    </>
  )
}

export default RecipeDetails
