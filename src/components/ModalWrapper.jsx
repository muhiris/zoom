import React from 'react'

function ModalWrapper(props) {

    
  return (
    <div style={{backdropFilter:"blur(2px)"}} className={`${!props.isOpen && 'hidden'} fixed flex items-center justify-center z-20 top-0 left-0 w-full h-full bg-[#0000005d]`}>
        <div style={props.style} className='m-auto rounded-lg bg-["#0B5CFF"] p-5 w-[90%] md:w-[50%] lg:w-[40%] max-w-full md:max-w-[80%] xl:max-w-[70%]'>
            {props.children}
        </div>
    </div>
  )
}

export default ModalWrapper