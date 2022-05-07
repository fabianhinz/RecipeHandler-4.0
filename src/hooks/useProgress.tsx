import React, { useState } from 'react'

import Progress, { ProgressVariant } from '../Components/Shared/Progress'

const useProgress = (variant?: ProgressVariant) => {
  const [progress, setProgress] = useState(false)

  return {
    setProgress,
    ProgressComponent: () => <>{progress && <Progress variant={variant || 'fixed'} />}</>,
  }
}

export default useProgress
