import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'

import AttachmentGalleryProvider from '@/Components/Provider/AttachmentGalleryProvider'
import BookmarkProvider from '@/Components/Provider/BookmarkProvider'
import CategoriesCollectionProvider from '@/Components/Provider/CategoriesCollectionProvider'
import DeviceOrientationProvider from '@/Components/Provider/DeviceOrientationProvider'
import GridProvider from '@/Components/Provider/GridProvider'
import RouterProvider from '@/Components/Provider/RouterProvider'
import SearchResultsProvider from '@/Components/Provider/SearchResultsProvider'
import SelectedAttachementProvider from '@/Components/Provider/SelectedAttachementProvider'
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@/Components/Provider/ThemeProvider'
import UsersProvider from '@/Components/Provider/UsersProvider'

import BreakpointsProvider from './Provider/BreakpointsProvider'
import FirebaseAuthProvider from './Provider/FirebaseAuthProvider'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export const AppProvider: FC = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider>
      <FirebaseAuthProvider>
        <BrowserRouter>
          <BreakpointsProvider>
            <CssBaseline />
            <SnackbarProvider
              preventDuplicate
              autoHideDuration={3000}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}>
              <RouterProvider>
                <DeviceOrientationProvider>
                  <UsersProvider>
                    <CategoriesCollectionProvider>
                      <GridProvider>
                        <SelectedAttachementProvider>
                          <AttachmentGalleryProvider>
                            <BookmarkProvider>
                              <SearchResultsProvider>
                                {children}
                              </SearchResultsProvider>
                            </BookmarkProvider>
                          </AttachmentGalleryProvider>
                        </SelectedAttachementProvider>
                      </GridProvider>
                    </CategoriesCollectionProvider>
                  </UsersProvider>
                </DeviceOrientationProvider>
              </RouterProvider>
            </SnackbarProvider>
          </BreakpointsProvider>
        </BrowserRouter>
      </FirebaseAuthProvider>
    </ThemeProvider>
  </StyledEngineProvider>
)
