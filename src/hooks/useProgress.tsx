import React, { useState } from 'react'

import Progress from '../Components/Shared/Progress'

const useProgress = () => {
    const [progress, setProgress] = useState(false)

    return {
        setProgress,
        ProgressComponent: () => <>{progress && <Progress variant="fixed" />}</>,
    }
}

export default useProgress
