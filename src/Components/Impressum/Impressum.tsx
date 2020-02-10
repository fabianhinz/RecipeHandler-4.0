import { Grid, Link, Typography } from '@material-ui/core'
import React from 'react'

import { useGridContext } from '../Provider/GridProvider'
import StyledCard from '../Shared/StyledCard'

const Impressum = () => {
    const { gridBreakpointProps } = useGridContext()

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant="h4">Impressum</Typography>
            </Grid>
            <Grid item {...gridBreakpointProps}>
                <StyledCard header="Kontakt">
                    <Typography>Fabian Hinz</Typography>
                    <Typography>Wiggenhauser Weg 36</Typography>
                    <Typography>88046 Friedrichshafen</Typography>
                    <Typography> Tel: 017645824976</Typography>
                    <Typography>hinzfabian.fh@gmail.com</Typography>
                </StyledCard>
            </Grid>
            <Grid item {...gridBreakpointProps}>
                <StyledCard header="Icons">
                    <div>
                        <Typography>
                            made by{' '}
                            <Link href="https://www.flaticon.com/authors/freepik">Freepik</Link>{' '}
                            from <Link href="https://www.flaticon.com/">www.flaticon.com</Link>
                        </Typography>
                        <Typography>
                            made by{' '}
                            <Link href="https://www.flaticon.com/authors/smashicons">
                                Smashicons
                            </Link>{' '}
                            from <Link href="https://www.flaticon.com/">www.flaticon.com</Link>
                        </Typography>
                    </div>
                </StyledCard>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4">Disclaimer - rechtliche Hinweise</Typography>
            </Grid>
            <Grid item {...gridBreakpointProps}>
                <StyledCard header="Auskunfts- und Widerrufsrecht">
                    <Typography>
                        Sie haben jederzeit das Recht, sich unentgeltlich und unverzüglich über die
                        zu Ihrer Person erhobenen Daten zu erkundigen. Ebenfalls können Sie Ihre
                        Zustimmung zur Verwendung Ihrer angegebenen persönlichen Daten mit Wirkung
                        für die Zukunft widerrufen. Hierfür wenden Sie sich bitte an den im
                        Impressum angegebenen Diensteanbieter.
                    </Typography>
                </StyledCard>
            </Grid>
            <Grid item {...gridBreakpointProps}>
                <StyledCard header="Datenschutz (allgemein)">
                    <Typography>
                        Beim Zugriff auf unsere Webseite werden automatisch allgemeine Informationen
                        (sog. Server-Logfiles) erfasst. Diese beinhalten u.a. den von Ihnen
                        verwendeten Webbrowser sowie Ihr Betriebssystem und Ihren Internet Service
                        Provider. Diese Daten lassen keinerlei Rückschlüsse auf Ihre Person zu und
                        werden von uns statistisch ausgewertet, um unseren Internetauftritt
                        technisch und inhaltlich zu verbessern. Das Erfassen dieser Informationen
                        ist notwendig, um den Inhalt der Webseite korrekt ausliefern zu können. Die
                        Nutzung der Webseite ist grundsätzlich ohne Angabe personenbezogener Daten
                        möglich. Soweit personenbezogene Daten (beispielsweise Name, Anschrift oder
                        E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf
                        freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung
                        nicht an Dritte weitergegeben. Sofern ein Vertragsverhältnis begründet,
                        inhaltlich ausgestaltet oder geändert werden soll oder Sie an uns eine
                        Anfrage stellen, erheben und verwenden wir personenbezogene Daten von Ihnen,
                        soweit dies zu diesem Zwecke erforderlich ist (Bestandsdaten). Wir erheben,
                        verarbeiten und nutzen personenbezogene Daten soweit dies erforderlich ist,
                        um Ihnen die Inanspruchnahme des Webangebots zu ermöglichen (Nutzungsdaten).
                        Sämtliche personenbezogenen Daten werden nur solange gespeichert wie dies
                        für den genannten Zweck (Bearbeitung Ihrer Anfrage oder Abwicklung eines
                        Vertrags) erforderlich ist. Hierbei werden steuer- und handelsrechtliche
                        Aufbewahrungsfristen von uns berücksichtigt. Auf Anordnung der zuständigen
                        Stellen müssen wir im Einzelfall Auskunft über diese Daten (Bestandsdaten)
                        erteilen, soweit dies für Zwecke der Strafverfolgung, zur Gefahrenabwehr,
                        zur Erfüllung der gesetzlichen Aufgaben der Verfassungsschutzbehörden oder
                        des Militärischen Abschirmdienstes oder zur Durchsetzung der Rechte am
                        geistigen Eigentum erforderlich ist. Wir weisen ausdrücklich darauf hin,
                        dass die Datenübertragung im Internet (z. B. bei der Kommunikation per
                        E-Mail) Sicherheitslücken aufweisen kann. Vor dem Zugriff auf Daten kann
                        nicht lückenlos geschützt werden. Die Nutzung von im Rahmen der
                        Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung
                        von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien
                        wird hiermit ausdrücklich untersagt. Ausgenommen hiervon sind bestehende
                        Geschäftsbeziehungen bzw. es liegt Ihnen eine entsprechende Einwilligung von
                        uns vor. Die Anbieter und alle auf dieser Website genannten Dritten behalten
                        sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung
                        von Werbeinformationen vor. Gleiches gilt für die kommerzielle Verwendung
                        und Weitergabe der Daten.
                    </Typography>
                </StyledCard>
            </Grid>
            <Grid item {...gridBreakpointProps}>
                <StyledCard header="Google Analytics">
                    <Typography>
                        Diese Website benutzt Google Analytics, einen Webanalysedienst der Google
                        Inc. ("Google"), 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
                        Google Analytics verwendet sog. "Cookies" (Textdateien), die auf Ihrem
                        Computer gespeichert werden und die eine Analyse der Benutzung der Website
                        durch Sie ermöglichen. Die durch das Cookie erzeugten Informationen über
                        Ihre Benutzung dieser Website werden in der Regel an einen Server von Google
                        in den USA übertragen und dort gespeichert. Im Falle der Aktivierung der
                        IP-Anonymisierung auf dieser Website, wird Ihre IP-Adresse von Google jedoch
                        innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen
                        Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor
                        gekürzt. Nur in Ausnahmefällen wird die vollständige IP-Adresse an einen
                        Server von Google in den USA übertragen und dort anonymisiert. Im Auftrag
                        des Betreibers dieser Website wird Google diese Informationen benutzen, um
                        Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten
                        zusammenzustellen und um weitere mit der Websitenutzung und der
                        Internetnutzung verbundene Dienstleistungen gegenüber dem Websitebetreiber
                        zu erbringen. Die im Rahmen von Google Analytics von Ihrem Browser
                        übermittelte IP-Adresse wird nicht mit anderen Daten von Google
                        zusammengeführt. Sie können die Speicherung der Cookies durch eine
                        entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie
                        jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche
                        Funktionen dieser Website vollumfänglich nutzen können. Sie können darüber
                        hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der
                        Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die
                        Verarbeitung dieser Daten durch Google verhindern, indem sie das unter dem
                        folgenden Link verfügbare Browser-Add-on herunterladen und installieren:
                        http://tools.google.com/dlpage/gaoptout?hl=de. Das Browser-Add-on zur
                        Deaktivierung von Google Analytics ist mit Chrome, Internet Explorer 8 bis
                        11, Safari, Firefox und Opera kompatibel. Weitere Informationen zu
                        Nutzungsbedingungen und Datenschutz finden Sie unter folgenden Links:
                        http://www.google.com/analytics/terms/de.html und
                        https://www.google.de/intl/de/policies/.
                    </Typography>
                </StyledCard>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4">Disclaimer (Haftungsausschluss)</Typography>
            </Grid>
            <Grid item {...gridBreakpointProps}>
                <StyledCard header="Haftung für Inhalte">
                    <Typography>
                        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf
                        diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10
                        TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte
                        oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
                        forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen
                        zur Entfernung oder Sperrung der Nutzung von Informationen nach den
                        allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
                        ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
                        Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
                        Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                    </Typography>
                </StyledCard>
            </Grid>
            <Grid item {...gridBreakpointProps}>
                <StyledCard header="Haftung für Inhalte">
                    <Typography>
                        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf
                        diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10
                        TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte
                        oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
                        forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen
                        zur Entfernung oder Sperrung der Nutzung von Informationen nach den
                        allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
                        ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
                        Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
                        Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                    </Typography>
                </StyledCard>
            </Grid>
            <Grid item {...gridBreakpointProps}>
                <StyledCard header="Urheberrecht">
                    <Typography>
                        Die durch die Diensteanbieter, deren Mitarbeiter und beauftragte Dritte
                        erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                        Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                        der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                        vorherigen schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                        Downloads und Kopien dieser Seite sind nur für den privaten, nicht
                        kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht
                        vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet.
                        Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
                        trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um
                        einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
                        werden derartige Inhalte umgehend entfernen.{' '}
                    </Typography>
                </StyledCard>
            </Grid>
        </Grid>
    )
}

export default Impressum
