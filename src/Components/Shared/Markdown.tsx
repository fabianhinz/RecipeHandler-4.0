import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'

const useStyles = makeStyles(theme =>
    createStyles({
        recipeContainer: {
            overflowX: 'hidden',
        },
        markdown: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
        },
        markdownLink: {
            color:
                theme.palette.type === 'dark'
                    ? theme.palette.primary.main
                    : theme.palette.primary.dark,
        },
    })
)

const Markdown = (props: Omit<ReactMarkdownProps, 'renderers' | 'className'>) => {
    const classes = useStyles()

    return (
        <ReactMarkdown
            renderers={{
                link: props => (
                    <a
                        className={classes.markdownLink}
                        href={props.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {props.children}
                    </a>
                ),
            }}
            className={classes.markdown}
            {...props}
        />
    )
}

export default Markdown
