import { Fab, Grid, LinearProgress, Tooltip } from '@mui/material'
import CameraIcon from '@mui/icons-material/Camera'
import compressImage from 'browser-image-compression'
import { getDoc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore'
import { ref, uploadString } from 'firebase/storage'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import FabContainer from '@/Components/Shared/FabContainer'
import NotFound from '@/Components/Shared/NotFound'
import Skeletons from '@/Components/Shared/Skeletons'
import { storage } from '@/firebase/firebaseConfig'
import {
  resolveDoc,
  resolveTrialsOrderedByCreatedDateDesc,
} from '@/firebase/firebaseQueries'
import { getFileExtension } from '@/hooks/useAttachment'
import { readDocumentAsync } from '@/hooks/useAttachmentDropzone'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { ChangesRecord, Trial } from '@/model/model'
import { getRecipeService } from '@/services/recipeService'

import TrialsCard from './TrialsCard'

// ToDo should use AttachmentDropzone hook
const Trials = () => {
  const [pagedTrials, setPagedTrials] = useState<Map<string, Trial>>(
    getRecipeService().pagedTrials
  )
  const [lastTrial, setLastTrial] = useState<Trial | undefined>()
  const [querying, setQuerying] = useState(false)

  const { user } = useFirebaseAuthContext()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { IntersectionObserverTrigger } = useIntersectionObserver({
    onIsIntersecting: () => {
      if (pagedTrials.size > 0) setLastTrial([...pagedTrials.values()].pop())
    },
  })

  useDocumentTitle('Ideen')

  useEffect(() => {
    setQuerying(true)

    return onSnapshot(
      resolveTrialsOrderedByCreatedDateDesc(lastTrial),
      querySnapshot => {
        const changes: ChangesRecord<Trial> = {
          added: new Map(),
          modified: new Map(),
          removed: new Map(),
        }

        for (const change of querySnapshot.docChanges()) {
          changes[change.type].set(change.doc.id, change.doc.data() as Trial)
        }

        setPagedTrials(trials => {
          for (const [docId] of changes.removed) {
            trials.delete(docId)
          }

          for (const [docId, modifiedTrial] of changes.modified) {
            trials.set(docId, modifiedTrial)
          }

          const newTrials = new Map([...trials, ...changes.added])
          getRecipeService().pagedTrials = newTrials

          return newTrials
        })
        setQuerying(false)
      }
    )
  }, [lastTrial])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) return

      const snackKey = enqueueSnackbar(
        'Dateien werden verarbeitet und hochgeladen',
        {
          variant: 'info',
        }
      )

      for (const file of acceptedFiles) {
        const name = file.name.replace(`.${getFileExtension(file.name)}`, '')
        const potentialDublicate = await getDoc(resolveDoc('trials', name))

        if (potentialDublicate.exists()) {
          enqueueSnackbar(
            `Ein Versuchskaninchen mit dem Namen ${file.name} existiert bereits`,
            {
              variant: 'warning',
            }
          )
          continue
        }
        const compressedFile: Blob = await compressImage(file, {
          maxSizeMB: 0.5,
          useWebWorker: false,
          maxWidthOrHeight: 3840,
          maxIteration: 5,
        })
        const dataUrl: string = await readDocumentAsync(compressedFile)

        try {
          const uploadTask = await uploadString(
            ref(storage, `trials/${file.name}`),
            dataUrl,
            'data_url',
            {
              cacheControl: 'public, max-age=31536000',
            }
          )

          setPagedTrials(new Map())
          setLastTrial(undefined)
          window.scrollTo({ top: 0, behavior: 'smooth' })

          const trialDoc: Trial = {
            name,
            fullPath: uploadTask.ref.fullPath,
            numberOfComments: 0,
            editorUid: user.uid,
            createdDate: Timestamp.fromDate(new Date()),
          }
          await setDoc(resolveDoc('trials', name), trialDoc)
        } catch (e) {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      }
      closeSnackbar(snackKey as string)
    },
    [closeSnackbar, enqueueSnackbar, user]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    noDragEventsBubbling: true,
    noDrag: true,
  })

  const handleTrialDelete = (trialName: string) => {
    // ? hacky...
    setPagedTrials(prev => {
      prev.delete(trialName)
      return new Map(prev)
    })
  }

  return (
    <>
      <EntryGridContainer>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {[...pagedTrials.values()].map(trial => (
              <TrialsCard
                onDelete={handleTrialDelete}
                trial={trial}
                key={trial.name}
              />
            ))}

            <Skeletons
              variant="trial"
              visible={querying && pagedTrials.size === 0}
            />

            <NotFound visible={!querying && pagedTrials.size === 0} />

            <Grid item xs={12}>
              {querying && <LinearProgress variant="query" color="secondary" />}
              <IntersectionObserverTrigger />
            </Grid>
          </Grid>
        </Grid>
      </EntryGridContainer>

      {user && (
        <FabContainer>
          <Tooltip title="Rezeptidee hinzufügen" placement="left">
            <div {...getRootProps()}>
              <Fab color="secondary">
                <CameraIcon />
              </Fab>
            </div>
          </Tooltip>
        </FabContainer>
      )}

      <input {...getInputProps()} />
    </>
  )
}

export default Trials
