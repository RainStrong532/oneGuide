import React from 'react'
import PublicProfileComponent from '../component/PublicProfileComponent'
import { connect } from 'react-redux'
import { updateProfileInfo } from '../actions'

const mapStateToProps = state => {
    const { user } = state
    return {
        user
    }
}

const PublicProfileContainer = connect(
    mapStateToProps,
    {
        updateProfileInfo
    }
)(PublicProfileComponent)

export default PublicProfileContainer