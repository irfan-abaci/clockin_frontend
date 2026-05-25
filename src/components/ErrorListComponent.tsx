import React, { FC, useMemo, useState } from 'react'

interface TPropsType{
    error_descriptions:string[]
}
const ErrorListComponent:FC<TPropsType> = ({error_descriptions}) => {
    const threshold = useMemo(() => 1, [])
    const [showAll, setShowAll] = useState(false);

  return (
    <>
    {error_descriptions.slice(0, showAll ? error_descriptions.length : threshold).map((error_description:string) => (
        <li key={error_description}>{error_description}</li>
      ))}
        {error_descriptions.length > threshold && (
          <a href='#' onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show less' : 'Read more'}
          </a>
        )}
    </>
  )
}

export default ErrorListComponent