
import React from 'react'
import Wrapper from './wrapper'
import { LoadingSpinner } from '../ui/loading-spinner'

const pageLoader = () => {
    return (
        <Wrapper className="py-20 min-h-[100vh] flex items-center justify-center">
            <LoadingSpinner message="Loading..." />
        </Wrapper>
    )
}

export default pageLoader