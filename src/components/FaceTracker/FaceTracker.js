import React from 'react';

const FaceTracker = ({ imageUrl }) => {
    return (
        <div className='center'>
            <img alt='' src={imageUrl} />

        </div>
    );
}

export default FaceTracker;