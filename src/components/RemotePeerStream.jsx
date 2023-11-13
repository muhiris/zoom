import React, { useEffect } from 'react'
import { ThreeCircles } from 'react-loader-spinner'

function RemotePeerStream(props) {

    useEffect(() => {
        if(props?.src){
            document.getElementById(`remotePeer-${props?.userId}`).srcObject = props?.src;
            // document.getElementById(`remotePeer-${props?.userId}`).style.transform = 'scaleX(-1)';
        }
    }, [props?.src])

    return (
        <div style={props.style} className='flex flex-1 relative w-full h-full items-center justify-center '>
            <video id={`remotePeer-${props.userId}`} autoPlay className='w-full h-full object-contain bg-black' />
            {
                props.name &&
                <p className='absolute bottom-0 left-0 right-0 text-white text-lg text-start bg-black bg-opacity-50'>{props.name}</p>
            }
            {
                props.loading &&
                <ThreeCircles
                    height={50}
                    width={50}
                    color="#ffffff"
                    wrapperStyle={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="three-circles-rotating"
                    outerCircleColor=""
                    innerCircleColor=""
                    middleCircleColor=""
                   
                />

            }
        </div>
    )
}

export default RemotePeerStream