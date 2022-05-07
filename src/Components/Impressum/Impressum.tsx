import { Box, Grid, Link, ListSubheader, Typography } from '@material-ui/core'
import React from 'react'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { useGridContext } from '../Provider/GridProvider'
import BuiltWithFirebase from '../Shared/BuiltWithFirebase'
import EntryGridContainer from '../Shared/EntryGridContainer'
import StyledCard from '../Shared/StyledCard'

const Impressum = () => {
  const { gridBreakpointProps } = useGridContext()

  useDocumentTitle('Impressum')

  return (
    <EntryGridContainer>
      <Grid item xs={12}>
        <Typography variant="h4">Impressum</Typography>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item {...gridBreakpointProps}>
            <StyledCard header="Haftung für Inhalte">
              <Typography gutterBottom>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
                Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
                als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
                rechtswidrige Tätigkeit hinweisen.
              </Typography>
              <Typography>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
                jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
                Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte
                umgehend entfernen.
              </Typography>
            </StyledCard>
          </Grid>
          <Grid item {...gridBreakpointProps}>
            <StyledCard header="Haftung für Links">
              <Typography gutterBottom>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
                keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
                Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
                Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum
                Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
                Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
              </Typography>
              <Typography>
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
                Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </Typography>
            </StyledCard>
          </Grid>
          <Grid item {...gridBreakpointProps}>
            <StyledCard header="Urheberrecht">
              <Typography gutterBottom>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
                Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
                Gebrauch gestattet.
              </Typography>
              <Typography>
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
                Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
                gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam
                werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
                Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </Typography>
            </StyledCard>
          </Grid>
          <Grid item {...gridBreakpointProps}>
            <StyledCard header="Angaben gemäß § 5 TMG">
              <Typography>Fabian Hinz</Typography>
              <Typography>Wiggenhauser Weg 36</Typography>
              <Typography>88046 Friedrichshafen</Typography>

              <ListSubheader disableGutters>Kontakt</ListSubheader>
              <Typography>Telefon: 017645824976</Typography>
              <Typography>E-Mail: hinzfabian.fh@gmail.com</Typography>
            </StyledCard>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography align="center">
          <i>
            Icons made by{' '}
            <Link target="_blank" href="https://www.flaticon.com/authors/freepik">
              Freepik
            </Link>{' '}
            and{' '}
            <Link target="_blank" href="https://www.flaticon.com/authors/smashicons">
              Smashicons
            </Link>{' '}
            from{' '}
            <Link target="_blank" href="https://www.flaticon.com/">
              www.flaticon.com
            </Link>{' '}
            and firebase from{' '}
            <Link
              target="_blank"
              href="https://github.com/firebase/quickstart-js/blob/master/firestore/images/guy_fireats.png">
              github
            </Link>
          </i>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <BuiltWithFirebase />
        </Box>
      </Grid>
    </EntryGridContainer>
  )
}

export default Impressum
